import Head from "next/head";
import { Fragment } from "react";
import { SignUpForm } from "../components/forms/singup";

export default function SingUp() {
  return (
    <Fragment>
      <Head>
        <title>Sign Up now!</title>
      </Head>
      <main>
        <SignUpForm/>
      </main>
    </Fragment>
  )
}