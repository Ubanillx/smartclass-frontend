declare module 'vue3-cropper' {
  import { DefineComponent } from 'vue';

  interface CropperProps {
    imagePath: string;
    fileType?: 'base64' | 'blob';
    imageType?: string;
    quality?: number;
    cropSize?: number;
    fixedBox?: boolean;
    showOutputSize?: boolean;
    mode?: string;
    maxImgSize?: number | null;
    showToolbar?: boolean;
  }

  interface CropperEvents {
    save: (result: string | Blob) => void;
    cancel: () => void;
  }

  const Cropper: DefineComponent<
    CropperProps,
    {},
    any,
    {},
    {},
    {},
    {},
    CropperEvents
  >;
  export default Cropper;
}
