#!/usr/bin/env bash
# Drives the BMW CarPlay demo on the iOS Simulator. See ../README.md.
#   run.sh up | drive [minutes] | at <place> | lang <de|fr> | soc <0-100> | refresh | reset | shot <name> | down
set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(dirname "$HERE")"
# iOS 18.6, not 26.5: the 26.5 simulator runtime crashes on any map template (see README).
DEVICE_NAME="${DEVICE_NAME:-BMW CarPlay 18.6}"
RUNTIME=com.apple.CoreSimulator.SimRuntime.iOS-18-6
BUNDLE=com.adobe.aida.BMWCarPlay
SHOTS="$HERE/shots"

find_udid() { xcrun simctl list devices available | grep -E "^\s+$DEVICE_NAME \(" | head -1 | sed -E 's/.*\(([0-9A-F-]{36})\).*/\1/'; }
UDID="${UDID:-$(find_udid)}"

# `up` creates the simulator when it is missing; every other command needs it to exist.
ensure_device() {
  [ -n "$UDID" ] && return
  xcrun simctl list runtimes | grep -q "iOS 18.6" || { echo "iOS 18.6 simulator runtime missing: xcodebuild -downloadPlatform iOS -buildVersion 18.6"; exit 1; }
  UDID="$(xcrun simctl create "$DEVICE_NAME" com.apple.CoreSimulator.SimDeviceType.iPhone-16-Pro "$RUNTIME")"
  echo "created simulator '$DEVICE_NAME' ($UDID)"
}
need_device() { [ -n "$UDID" ] || { echo "no simulator named '$DEVICE_NAME': run ./demo/run.sh up first (or set DEVICE_NAME or UDID)"; exit 1; }; }

# iOS 18 asks "Open in BMW?" on the phone for every simctl openurl, so the link goes through a file and a notification.
url() {
  local dir; dir="$(xcrun simctl get_app_container "$UDID" "$BUNDLE" data)"
  printf '%s\n' "bmwcarplay://$1" > "$dir/Documents/cmd.txt"
  xcrun simctl spawn "$UDID" notifyutil -p "$BUNDLE.cmd"
}

place() {
  case "$1" in
    munich)     echo "48.1766,11.5611" ;;
    iphitos)    echo "48.1845,11.6148" ;;
    bmw-park)   echo "48.1260,11.5254" ;;
    ruhpolding) echo "47.7150,12.6479" ;;
    salzburg)   echo "47.8095,13.0550" ;;
    *) echo "unknown place '$1' (munich iphitos bmw-park ruhpolding salzburg)" >&2; exit 1 ;;
  esac
}

carplay_open() { xcrun simctl io "$UDID" enumerate 2>&1 | grep -q "DisplayAdapter" ; }

cmd_up() {
  ensure_device
  command -v xcodebuild >/dev/null || { echo "xcodebuild missing: install Xcode 26.6"; exit 1; }
  (cd "$ROOT" && xcodebuild -project BMWCarPlay.xcodeproj -scheme BMWCarPlay \
     -destination "platform=iOS Simulator,id=$UDID" -derivedDataPath build build | grep -E "error:|BUILD" || true)
  xcrun simctl boot "$UDID" 2>/dev/null || true
  xcrun simctl bootstatus "$UDID" -b >/dev/null
  open -a Simulator --args -CurrentDeviceUDID "$UDID"
  xcrun simctl install "$UDID" "$ROOT/build/Build/Products/Debug-iphonesimulator/BMWCarPlay.app"
  xcrun simctl privacy "$UDID" grant location "$BUNDLE"
  xcrun simctl location "$UDID" set "$(place munich)"
  xcrun simctl terminate "$UDID" "$BUNDLE" 2>/dev/null || true
  xcrun simctl launch "$UDID" "$BUNDLE" >/dev/null
  # Opening the CarPlay window and tapping the icon needs Accessibility for the terminal app.
  if osascript -e 'tell application "System Events" to tell process "Simulator" to click menu item "CarPlay" of menu "External Displays" of menu item "External Displays" of menu "I/O" of menu bar 1' 2>/dev/null; then
    echo "CarPlay window opened."
  else
    echo "Could not open CarPlay by script (no Accessibility access)."
    echo "Do it by hand: Simulator > I/O > External Displays > CarPlay, then tap the BMW icon."
  fi
}

# Route files: drive-munich-salzburg.txt is the default route, drive-munich-salzburg-<route>.txt the other one
# (make-drive.mjs writes both). ROUTE=direct ./demo/run.sh drive 2 plays the direct A8 route.
DEFAULT_ROUTE=via-ruhpolding   # keep in sync with DEFAULT_ROUTE in make-drive.mjs
MIN_INTERVAL="${MIN_INTERVAL:-0.05}"   # seconds between location updates; 0.05 = 20 per second at most

# simctl plays the waypoints as straight lines. With --interval it sends one update per interval and moves at most
# speed x interval per update; a segment shorter than that still costs one whole interval. So the drive does not run
# at "speed": it takes (waypoints - 1) x interval, and the points are denser in bends than on straights. To make
# `drive N` last N minutes the interval is N*60/(waypoints-1), and the speed is set high enough that no segment
# is split (speed x interval >= 2 x longest segment), so every update lands exactly on a waypoint.
cmd_drive() {
  local minutes="${1:-4}" route="${ROUTE:-$DEFAULT_ROUTE}" file stats n km maxseg interval speed
  if [ "$route" = "$DEFAULT_ROUTE" ]; then file="$HERE/drive-munich-salzburg.txt"; else file="$HERE/drive-munich-salzburg-$route.txt"; fi
  [ -f "$file" ] || { echo "unknown ROUTE '$route': use direct or via-ruhpolding"; exit 1; }
  stats="$(awk -F, 'function rad(d){return d*3.141592653589793/180}
    NR>1{dl=rad($1-la);dn=rad($2-lo);h=sin(dl/2)^2+cos(rad(la))*cos(rad($1))*sin(dn/2)^2;d=12742000*atan2(sqrt(h),sqrt(1-h));t+=d;if(d>m)m=d}
    {la=$1;lo=$2}
    END{printf "%d %.3f %.1f",NR,t/1000,m}' "$file")"
  read -r n km maxseg <<< "$stats"
  interval="$(awk -v m="$minutes" -v n="$n" -v min="$MIN_INTERVAL" 'BEGIN{i=m*60/(n-1);if(i<min)i=min;printf "%.3f",i}')"
  speed="$(awk -v s="$maxseg" -v i="$interval" 'BEGIN{printf "%d",2*s/i+1}')"
  xcrun simctl location "$UDID" clear || true
  xcrun simctl location "$UDID" start --speed="$speed" --interval="$interval" - < "$file"
  awk -v r="$route" -v km="$km" -v n="$n" -v i="$interval" -v m="$minutes" 'BEGIN{
    printf "driving Munich to Salzburg (%s): %.0f km, %d waypoints, one update every %.3f s (%.1f per second), %.1f min", r, km, n, i, 1/i, (n-1)*i/60;
    if ((n-1)*i/60 > m*1.02) printf " (longer than %s min: update rate capped at %.0f per second, set MIN_INTERVAL lower to go faster)", m, 1/i;
    printf "\n"}'
}

cmd_at()      { xcrun simctl location "$UDID" set "$(place "$1")"; }
cmd_lang()    { url "vehicle?lang=$1"; }
cmd_soc()     { url "vehicle?soc=$1"; }
cmd_refresh() { url "refresh"; }
cmd_reset() {
  xcrun simctl location "$UDID" clear || true
  xcrun simctl location "$UDID" set "$(place munich)"
  url "reset"
}
cmd_shot() { mkdir -p "$SHOTS"; xcrun simctl io "$UDID" screenshot --display external "$SHOTS/${1:-shot}.png"; }
cmd_down() {
  xcrun simctl location "$UDID" clear || true
  xcrun simctl terminate "$UDID" "$BUNDLE" 2>/dev/null || true
}

sub="${1:-}"; shift || true
[ "$sub" = up ] || [ -z "$sub" ] || need_device
case "$sub" in
  up|drive|at|lang|soc|refresh|reset|shot|down) "cmd_$sub" "$@" ;;
  *) sed -n '2,3p' "$0"; exit 1 ;;
esac
