import "twin.macro";
import { getLowo, TextField, CardTailWindExample } from "@oyelowo/ui";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Bars, { useChart } from "../charts/echarts/ChartWithHooks";
import Link from "next/link";

import MyD3Charts from "../charts/d3/App";
import ReactEcharts from "../charts/echarts/ReactEcharts";
import ReactEChartCustom from "../charts/echarts/ChartWithHooks";

// import { useStockCandleCharts } from "../charts/echarts/TradingChart";
import { tradingChartOption } from "../charts/echarts/StockChartTA";
import { taChartOption } from "../charts/echarts/TAChart";
import { multiChartOptions } from "../charts/echarts/chartMulti";
import { useCandleChart } from "../charts/echarts/useCandleChart";
import { useCreateUserMutation } from "@oyelowo/graphql-client";
const Input = () => <input tw="border hover:border-red-50 text-red-500" />;

const Home: NextPage = () => {
  // const {ReactCharts: CandleStickChart, chart} = useStockCandleCharts();
  const { ReactCharts: CandleChart1 } = useChart({
    option: tradingChartOption,
  });
  // const { ReactCharts: TAChart } = useChart({
  //   option: taChartOption,
  // });
  const { CandleStickCharts } = useCandleChart();
  const { ReactCharts: MultiChart } = useChart({
    option: multiChartOptions,
  });
  
  const { mutate } = useCreateUserMutation();
  return (
    <div tw="bg-black h-screen text-white">
      <Head>
        <title>Template App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main tw="bg-black">
        another name {getLowo()} <br />
        <br />
        Create Dummy User
        <button
          onClick={() => {
            mutate({
              userInput: {
                firstName: "Oyelowo",
                lastName: "Oyedayo",
                socialMedia: ["fd"],
                age: 19,
                email: "oye@gmail.com",
              },
            });
          }}
        ></button>
        <br />
        <Link href="/hello">
          <a tw="text-gray-50">Link to charts</a>
        </Link>
        <div tw="height[500px]">
          <ReactEcharts />
        </div>
        <div tw="height[96vh] width[100vw] m-auto">{CandleStickCharts}</div>
        {/* <div tw="height[96vh] width[100vw] m-auto">{TAChart}</div> */}
        <div tw="height[700px]">{MultiChart}</div>
        <div tw="height[700px]">{CandleChart1}</div>
        Home of grind!
        <TextField
          label="Oyelowo Oyedayo"
          description="The sweet field"
          errorMessage="Bad error"
        />
        <CardTailWindExample />
        <div tw="text-blue-600">
          Separate
          <Input />
          Enter
        </div>
      </main>

      <footer>
        <a
          href="https://codebreather.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by Code breather
        </a>
      </footer>
    </div>
  );
};

export default Home;
