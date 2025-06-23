import { useHelmet } from "../HelmetContext";
import { Fragment } from "react";

export interface IHelmetHeadProps {
  title: string,
  description?: string
};

export const HelmetHead = (props: IHelmetHeadProps) => {
  const helmet = useHelmet();
  if(helmet) {
    helmet.setTitle(props.title);
    helmet.addMeta({ property: "og:title", content: props.title });
    props.description && helmet.addMeta({ name: "description", content: props.description });
    return <Fragment />;
  }
  return (
    <Fragment>
      <meta
        content={props.title}
        property="og:title"
      />
      <title>{props.title}</title>
      {props.description && <meta name="description" content={props.description} />}
    </Fragment>
  );
};

export default HelmetHead;
