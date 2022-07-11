import { ReactElement } from 'react';

import { NextPageWithLayout } from './_app';
import { Layout } from '../components/Layout/Layout';
import LineChart from '../charts/d3/LineChart/LineChart';
import { useWindowSize } from 'react-use';
import { useElementSize } from '@mantine/hooks';
import VoronoiHoverTracker from '../charts/d3/Voronoi/Voronoi';
import { Space } from '@mantine/core';

const Page: NextPageWithLayout = () => <p>hello world</p>;

Page.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      <Settings />
    </Layout>
  );
};

export default Page;

function Settings() {
  const { width, height } = useWindowSize();
  const element = useElementSize();

  return (
    <div ref={element.ref}>
      {/* <Chart /> */}
      <VoronoiHoverTracker width={element.width} height={400} />
      {/* <VoronoitHtmlToolTip /> */}

      <Space h="lg" />

      <LineChart width={element.width} height={400} />
    </div>
  );
}
