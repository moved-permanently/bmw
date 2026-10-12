#!/usr/bin/env bash
# Drives the BMW CarPlay demo on the iOS Simulator. See ../README.md.
#   run.sh up | drive [minutes] | at <place> | lang <de|fr> | soc <0-100> | refresh | reset | shot <name> | down
set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(dirname "$HERE")"
DEVICE_NAME="${DEVICE_NAME:-iPhone 17}"
BUNDLE=com.adobe.aida.BMWCarPlay
SHOTS="$HERE/shots"

UDID="${UDID:-$(xcrun simctl list devices available | grep -E "^\s+$DEVICE_NAME \(" | head -1 | sed -E 's/.*\(([0-9A-F-]{36})\).*/\1/')}"
[ -n "$UDID" ] || { echo "no simulator named '$DEVICE_NAME' (set DEVICE_NAME or UDID)"; exit 1; }

url() { xcrun simctl openurl "$UDID" "bmwcarplay://$1"; }

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

cmd_drive() {
  local minutes="${1:-4}" meters speed
  # one waypoint every 500 m (make-drive.mjs); an update at each waypoint
  meters=$(( ($(wc -l < "$HERE/drive-munich-salzburg.txt") - 1) * 500 ))
  speed=$(( meters / (minutes * 60) ))
  xcrun simctl location "$UDID" clear || true
  xcrun simctl location "$UDID" start --speed="$speed" --distance=500 - < "$HERE/drive-munich-salzburg.txt"
  echo "driving Munich to Salzburg: $((meters / 1000)) km in about $minutes min (${speed} m/s)"
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
case "$sub" in
  up|drive|at|lang|soc|refresh|reset|shot|down) "cmd_$sub" "$@" ;;
  *) sed -n '2,3p' "$0"; exit 1 ;;
esac
