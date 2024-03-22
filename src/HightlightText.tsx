import React from "react";

interface Props {
  searched: string;
  text: string;
}

function HightlightText(props: Props) {
  const { searched, text } = props;
  const handleHightlight = (search: string) => {
    const regex = new RegExp(`(${search})`, "gi");
    const hightlighted = text.replace(regex, "<mark>$1</mark>");
    return { __html: hightlighted };
  };
  return <div dangerouslySetInnerHTML={handleHightlight(searched)} />;
}

export default HightlightText;
