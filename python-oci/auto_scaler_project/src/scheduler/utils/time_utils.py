
from datetime import datetime, timedelta, timezone
import time

def utc_now():
    """Returns the current time in UTC."""
    return datetime.now(timezone.utc)

def format_datetime(dt):
    """Formats a datetime object to a standard string format."""
    if dt is None:
        return None
    return dt.strftime("%Y-%m-%d %H:%M:%S UTC")

def parse_datetime(dt_str):
    """Parses a datetime string into a datetime object."""
    if not dt_str:
        return None
    return datetime.strptime(dt_str, "%Y-%m-%d %H:%M:%S UTC").replace(tzinfo=timezone.utc)

def get_uptime():
    """Returns the system uptime in seconds."""
    try:
        with open('/proc/uptime', 'r') as f:
            uptime_seconds = float(f.readline().split()[0])
        return uptime_seconds
    except:
        # Fallback for non-Linux systems
        return time.time() - time.monotonic()
