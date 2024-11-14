import { ChangeEvent, useContext } from "react";

import { IdentityContext } from "@/app/lib/context/identity";
import { getServerUrl } from "@/lib/constants/env";
import { NewImage } from "@/lib/models";

interface IProps {
  width?: number;
  height?: number;
  imageId?: number;
  disabled?: boolean;
  gray?: boolean;
  onImageIdChange: (id: number) => void;
}

export default function ImageUploader(props: IProps) {
  const identity = useContext(IdentityContext);

  const handleFileChosen = (e: ChangeEvent<HTMLInputElement>) => {
    if (identity.session && e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const sessionToken = identity.session.token;

      const reader = new FileReader();
      reader.onload = async () => {
        const uploadResponse = await fetch(
          getServerUrl("/api/image/adventure_cover"),
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${sessionToken}`,
            },
            body: reader.result,
          },
        );
        const uploadBody = (await uploadResponse.json()) as NewImage;
        props.onImageIdChange(uploadBody.id);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <div
      className={`relative flex justify-center items-center border-2 border-dashed ${
        props.gray ? "border-grayscale-500" : "border-highlight"
      }  ${props.disabled ? "" : "hover:bg-grayscale-900"}`}
      style={{
        width: props.width ? `${props.width}px` : "13rem",
        height: props.height ? `${props.height}px` : "16rem",
      }}
    >
      {props.imageId ? (
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `url(${getServerUrl(`/api/image/${props.imageId}`)})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "contain",
            backgroundPosition: "center",
          }}
        ></div>
      ) : (
        <div className="relative flex justify-center items-center w-10 h-10">
          <div
            className={`absolute w-full h-px ${props.disabled ? "bg-grayscale-500" : "bg-highlight"}`}
          ></div>
          <div
            className={`absolute w-px h-full ${props.disabled ? "bg-grayscale-500" : "bg-highlight"}`}
          ></div>
        </div>
      )}
      {!props.disabled && (
        <input
          type="file"
          accept="image/*"
          className="absolute left-0 top-0 right-0 bottom-0 opacity-0 cursor-pointer"
          onChange={handleFileChosen}
        />
      )}
      {props.imageId && props.gray && (
        <div className="absolute left-0 top-0 right-0 bottom-0 bg-black/50" />
      )}
    </div>
  );
}
