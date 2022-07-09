import { useThemeAtom } from '@oyelowo/ui/components';
import {
  Button,
  Divider,
  Space,
  Box,
  Container,
  SimpleGrid,
  Grid,
  useMantineTheme,
} from '@mantine/core';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useChart } from '../charts/echarts/ChartWithHooks';
import Link from 'next/link';
import ReactEcharts from '../charts/echarts/ReactEcharts';
import { tradingChartOption } from '../charts/echarts/StockChartTA';
import { multiChartOptions } from '../charts/echarts/chartMulti';
import { useCandleChart } from '../charts/echarts/useCandleChart';
import { useEffect } from 'react';
import { taChartOption } from '../charts/echarts/TAChart';

// import Box from "../3D/Box";

const HomePage: NextPage = () => {
  // theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
  // const [theme, setTheme] = useThemeAtom();
  const { colorScheme } = useMantineTheme();
  const theme = colorScheme === 'dark' ? 'dark' : 'vintage';

  const { ReactCharts: TAChart } = useChart({
    option: tradingChartOption,
    theme: 'dark',
  });
  const { CandleStickCharts } = useCandleChart();

  const { ReactCharts: MultiChart, chart } = useChart({
    option: multiChartOptions,
    theme: 'dark',
  });
  // chart?.showLoading()

  // useEffect(() => {
  //   setTheme('dark');
  // }, []);

  return (
    <>
      <Head>
        <title>Template App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container>
        {/* <Link href="/hello">
          <Button component="a" my="sm" variant="gradient">
            Link to charts
          </Button>
        </Link>
        <Space />
        <Link href="/random">
          <Button component="a" my="sm" variant="outline">
            Goto Random Rogue Users
          </Button>
        </Link>
        <Divider my="sm" /> */}
        <SimpleGrid style={{ minHeight: '60vh' }} my="lg">
          <ReactEcharts />
        </SimpleGrid>
        <SimpleGrid style={{ minHeight: '60vh' }} my="lg">
          <CandleStickCharts />
        </SimpleGrid>
        <SimpleGrid style={{ minHeight: '60vh' }} my="lg">
          <MultiChart />
        </SimpleGrid>
        <SimpleGrid style={{ minHeight: '60vh' }} my="lg">
          <TAChart />
        </SimpleGrid>
      </Container>
    </>
  );
};

export default HomePage;
