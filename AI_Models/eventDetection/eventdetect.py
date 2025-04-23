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


    def detect_uploadMetadata(results):
        #retreive metadata from filename
        pass

    def detect_chathistory_data():
        pass

    def detect_postEvent():
        pass

print(datetime.datetime.now().date())