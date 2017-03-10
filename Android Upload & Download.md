# Android Upload & Download with Firebase

## Upload
https://firebase.google.com/docs/storage/android/upload-files

上傳可分為 *從 memory*、*從 Stream* 跟 *local file*
由之前的討論應該會使用到的是第一個 *從 memory*
以下我簡略說明一下流程：

### 1.先 create firebase reference 來對 storage 動作

```java
StorageReference stRef= storageRef.child("videos/vvv.mp4");
// videos/vvv.mp4 這樣寫的話會自動在 storage 中創一個 videos 資料夾放 vvv.mp4 
```

### 2.假設上傳的影像已經轉成 byte[] data
利用 UploadTask 作聽上傳狀態：

```java
UploadTask ut = stRef.putBytes(data); 
// 如果不是轉成 bite 是讀檔近來也可用 putFile() or putStream() 上傳
ut.addOnFailureListener(new OnFailureListener() {
    @Override
    public void onFailure(@NonNull Exception exception) {
        // 處理上傳失敗的狀況
    }
}).addOnSuccessListener(new OnSuccessListener<UploadTask.TaskSnapshot>() {
    @Override
    public void onSuccess(UploadTask.TaskSnapshot taskSnapshot) {
        // taskSnapshot.getMetadata() 可拿到檔案的 metadata (像 size, content-type, and download URL.
        Uri downloadUrl = taskSnapshot.getDownloadUrl();
    }
});
```

## Download
https://firebase.google.com/docs/storage/android/download-files

### 1.一樣是先 create firebase reference

```java
StorageReference stRef = storageRef.child("videos/vvv.mp4");
```

### 2.以載到 memory 為例

```java
final long ONE_MEGABYTE = 1024 * 1024; // size
stRef.getBytes(ONE_MEGABYTE).addOnSuccessListener(new OnSuccessListener<byte[]>() {
    @Override
    public void onSuccess(byte[] bytes) {
        // Data for "videos/vvv.mp4" is returns, use this as needed
    }
}).addOnFailureListener(new OnFailureListener() {
    @Override
    public void onFailure(@NonNull Exception exception) {
        // Handle any errors
    }
});
```

也可以直接透過 URL：

```java
stRef.getDownloadUrl().addOnSuccessListener(new OnSuccessListener<Uri>() {
    @Override
    public void onSuccess(Uri uri) {
        // Got the download URL for 'videos/vvv.mp4'
    }
}).addOnFailureListener(new OnFailureListener() {
    @Override
    public void onFailure(@NonNull Exception exception) {
        // Handle any errors
    }
});
```
