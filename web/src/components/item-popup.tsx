import { useContext, useEffect, useState } from "react";

import { AdventureItem, NewImage } from "@/lib/models";
import Button from "./button";
import Popup from "./popup";
import AiButton from "./ai-button";
import ImageUploader from "./image-uploader";
import { getServerUrl } from "@/lib/constants/env";
import { IdentityContext } from "@/app/lib/context/identity";

interface IProps {
  mode: "create" | "edit" | "view";
  item?: AdventureItem;
  onClose?: Function;
  onSubmit?: Function;
  onDelete?: Function;
}

export default function ItemPopup(props: IProps) {
  const identity = useContext(IdentityContext);

  const [name, setName] = useState<string>("");
  const [imageId, setImageId] = useState<number | undefined>(undefined);
  const [generating, setGenerating] = useState<boolean>(false);

  const handleGenerateImage = async () => {
    setGenerating(true);

    const response = await fetch(
      getServerUrl(`/api/item/${props.item?.id}/ai/image`),
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${identity.session!.token}`,
        },
      },
    );
    const body = (await response.json()) as NewImage;
    setImageId(body.id);
    setGenerating(false);
  };

  useEffect(() => {
    if (props.item) {
      setName(props.item.name);
      setImageId(props.item.image ?? undefined);
    } else {
      setName("");
      setImageId(undefined);
    }
  }, [props.item]);

  return (
    <Popup
      title={
        props.mode === "create"
          ? "Create New Item"
          : props.mode === "edit"
            ? "Edit Item"
            : "View Item"
      }
      onClose={props.onClose}
    >
      <div className="flex flex-col p-8 gap-6">
        <div className="flex flex-col gap-4">
          <p className="text-sm">Name</p>
          <input
            className="flex-grow px-3 py-2 rounded text-white text-base bg-grayscale-900 focus:outline focus:outline-highlight"
            type="text"
            placeholder="Name of the new Item"
            value={name}
            onChange={(e) => setName(e.target.value)}
            readOnly={props.mode === "view"}
          />
          {props.mode !== "create" && (
            <>
              <p className="text-sm">Image</p>
              <div className="flex items-center justify-center gap-6">
                <ImageUploader
                  width={256}
                  height={256}
                  imageId={imageId}
                  disabled={props.mode !== "edit" || generating}
                  gray={generating}
                  onImageIdChange={setImageId}
                />
                {props.mode === "edit" && (
                  <AiButton
                    disabled={generating}
                    className="absolute ml-96"
                    onClick={handleGenerateImage}
                  />
                )}
              </div>
            </>
          )}{" "}
        </div>
        {props.mode !== "view" && (
          <div className="flex justify-center gap-4">
            <Button
              text={props.mode === "create" ? "Create" : "Save"}
              onClick={() => {
                if (props.onSubmit) {
                  props.onSubmit(name, imageId ?? null);
                }
              }}
            />
            {props.mode === "edit" && (
              <Button
                text="Delete"
                onClick={() => {
                  if (props.onDelete) {
                    props.onDelete();
                  }
                }}
              />
            )}
          </div>
        )}
      </div>
    </Popup>
  );
}
