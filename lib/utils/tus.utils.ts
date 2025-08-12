import { AudioRecorder } from "expo-audio";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { DetailedError, Upload } from "tus-js-client";
import { UserInfo } from "../supabase/authStore";
import { supabaseUrl } from "../supabase/supabase";

export const uploadFiles = async (
  user: UserInfo,
  bucketName: string,
  filename: string,
  pickerResult: ImagePicker.ImagePickerResult | DocumentPicker.DocumentPickerResult,
  onProgress: (bytesUploaded: number, bytesTotal: number) => Promise<void> = onProgressDefault,
  onError: (error: Error | DetailedError) => Promise<void> = onErrorDefault,
  onSuccess: () => Promise<void> = onSuccessDefault
) => {
  if (!pickerResult.assets?.length) {
    throw Error("No file has been selected");
  }

  const allUploads = pickerResult.assets.map((pickerAsset: ImagePicker.ImagePickerAsset | DocumentPicker.DocumentPickerAsset) => {
    return uploadFile(user, bucketName, filename, pickerAsset, onProgress, onError, onSuccess);
  });
  await Promise.allSettled(allUploads);
  return;
};

export const uploadFile = async (
  user: UserInfo,
  bucketName: string,
  filename: string,
  pickerAsset: ImagePicker.ImagePickerAsset | DocumentPicker.DocumentPickerAsset | AudioRecorder,
  onProgress: (bytesUploaded: number, bytesTotal: number) => Promise<void> = onProgressDefault,
  onError: (error: Error | DetailedError) => Promise<void> = onErrorDefault,
  onSuccess: () => Promise<void> = onSuccessDefault
): Promise<void> => {
  const uri = (pickerAsset as { uri: string }).uri; // <<<---- this works for ImagePickerAsset, DocumentPickerAsset AND AudioRecorder
  const mimeType = (pickerAsset as { mimeType?: string }).mimeType || "application/octet-stream";

  return new Promise<void>(async (resolve, reject) => {
    const blob = await fetch(uri).then((res) => res.blob());
    let upload = new Upload(blob, {
      endpoint: `${supabaseUrl}/storage/v1/upload/resumable`,
      retryDelays: [0, 3000, 5000, 10000, 20000],
      headers: {
        authorization: `Bearer ${user.accessToken}`,
        "x-upsert": "true",
      },
      uploadDataDuringCreation: true,
      removeFingerprintOnSuccess: true,
      metadata: {
        bucketName: bucketName,
        // @ts-ignore TODO: check why types are acting up here.
        objectName: filename,
        contentType: mimeType,
        cacheControl: "3600",
      },
      chunkSize: 6 * 1024 * 1024, // NOTE: it must be set to 6MB (for now) do not change it
      onError: async function (error) {
        await onError(error);
        reject(error);
      },
      onProgress: async function (bytesUploaded, bytesTotal) {
        await onProgress(bytesUploaded, bytesTotal);
      },
      onSuccess: async function () {
        await onSuccess();
        resolve();
      },
    });

    return upload.findPreviousUploads().then(function (previousUploads) {
      if (previousUploads.length) {
        upload.resumeFromPreviousUpload(previousUploads[0]);
      }

      upload.start();
    });
  });
};

const onErrorDefault = async (error: Error | DetailedError) => {
  console.debug("Failed because: " + error.message);
};

const onProgressDefault = async (bytesUploaded: number, bytesTotal: number) => {
  var percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
  console.debug(bytesUploaded, bytesTotal, percentage + "%");
};

const onSuccessDefault = async () => {
  console.debug("Uploaded success");
};
