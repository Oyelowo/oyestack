import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { getLowo, CardTailWindExample, TextField } from "@oyelowo/lib-core";

const Home: NextPage = () => {
  return (
    <div className="bg-black h-screen text-white">
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        another name {getLowo()}
        Home of grind!
        <CardTailWindExample />
        <TextField label="Oyelowo" description="The sweet field" errorMessage="Bad error" />
      </main>

      <footer>
        <a href="https://codebreather.com" target="_blank" rel="noopener noreferrer">
          Powered by Code breather
        </a>
      </footer>
    </div>
  );
};

export default Home;
