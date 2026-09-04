import React from "react";
import PageTitle from "./PageTitle";

type Props = {
    title: string
    children: React.ReactNode
}

export default function Content({title, children}: Props) {
  return (
        <main className="">
            <PageTitle title={title} />
            {children}
        </main>
  )
}
