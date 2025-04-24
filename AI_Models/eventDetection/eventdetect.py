import datetime

class eventDetection:
    def detectEvent(results, timeWindow=120, min_uploads=3):
        currentDate = datetime.datetime.now().date()
        timestamps = []
        uploads_on_same_day = []

        for i in results:
            upload_dt = datetime.datetime.strptime(str(i['uploadDate']), "%Y-%m-%d %H:%M:%S.%f")
            if upload_dt.date() == currentDate:
                timestamps.append(upload_dt)
                uploads_on_same_day.append((upload_dt, i))

        timestamps.sort()

        for i in range(len(timestamps)):
            current_event_uploads = []
            count = 1
            current_event_uploads.append(uploads_on_same_day[i][1])

            for j in range(i + 1, len(timestamps)):
                diff = (timestamps[j] - timestamps[i]).total_seconds() / 60
                if diff <= timeWindow:
                    count += 1
                    current_event_uploads.append(uploads_on_same_day[j][1])
                else:
                    break

            if count >= min_uploads:
                return True, current_event_uploads  # Return only the relevant uploads

        return False, []

    def detect_events(data, time_window_minutes=120, min_uploads=3):
        uploads = []

        for item in data:
            dt = datetime.datetime.strptime(str(item["uploadDate"]), "%Y-%m-%d %H:%M:%S.%f")
            uploads.append((dt, item["analytics"], item))

        # Sort by datetime
        uploads.sort(key=lambda x: x[0])

        events = []
        i = 0

        while i < len(uploads):
            current_group = [uploads[i][2]]
            base_time = uploads[i][0]
            base_label = uploads[i][1]
            j = i + 1

            while j < len(uploads):
                time_diff = (uploads[j][0] - base_time).total_seconds() / 60.0
                label_match = uploads[j][1] == base_label

                if time_diff <= time_window_minutes and label_match:
                    current_group.append(uploads[j][2])
                    j += 1
                else:
                    break

            if len(current_group) >= min_uploads:
                events.append({
                    "label": base_label,
                    "uploads": current_group
                })

            i = j

        return events
