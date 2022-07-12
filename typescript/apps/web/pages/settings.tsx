import { ReactElement } from 'react';

import { useElementSize } from '@mantine/hooks';
import { Space } from '@mantine/core';
import { NextPageWithLayout } from './_app';
import { Layout } from '../components/Layout/Layout';
import LineChart from '../charts/d3/LineChart/LineChart';
import VoronoiHoverTracker from '../charts/d3/Voronoi/Voronoi';

function Settings() {
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

const Page: NextPageWithLayout = () => <p>hello world</p>;

Page.getLayout = function getLayout(_page: ReactElement) {
  return (
    <Layout>
      <Settings />
    </Layout>
  );
};

export default Page;
