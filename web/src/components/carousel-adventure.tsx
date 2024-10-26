"use client";

import Image from "next/image";
import { StaticImport } from "next/dist/shared/lib/get-img-props";

import Button from "@/components/button";
import EditButton from "./edit-button";

interface IProps {
  name: string;
  cover: string | StaticImport;
  description?: string | null;
  detailsLink?: string;
  onEdit?: Function;
}

export default function CarouselAdventure(props: IProps) {
  const pars = props.description ? props.description.split("\n") : [];

  return (
    <div className="flex items-start gap-7">
      <Image
        className="border-2 border-highlight"
        src={props.cover}
        width={275}
        height={400}
        alt="Adventure cover"
      />
      <div className="flex flex-col grow gap-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-3xl">{props.name}</h3>
            {props.onEdit && <EditButton onClick={props.onEdit} />}
          </div>
          <div className="flex flex-col gap-3">
            {pars.map((p) => (
              <p key={p} className="text-sm">
                {p}
              </p>
            ))}
          </div>
        </div>
        <div className="flex gap-6">
          <Button text="Start Adventure" onClick={() => {}} />
          {props.detailsLink && (
            <Button text="View Details" link={props.detailsLink} />
          )}
        </div>
      </div>
    </div>
  );
}
