import Head from 'next/head';
import 'bootstrap/dist/css/bootstrap.min.css';
import EventList from '../components/eventList';

export default function Home({ events, sortList }) {

  return (
    <>
      <Head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <title>BlockEvent</title>
      </Head>

      <main>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center", margin: "3rem" }}>
          <h4>
            <b>
              Unlock the future of event tickets with NFT's
            </b>
          </h4>
          <h5>
            Buy, trade and store safely in your wallet
          </h5>
        </div>
        <div tyle={{ marginLeft: "2rem" }}>
          <h4><b style={{ marginLeft: "2rem" }}>Coming Up:</b></h4>
          <EventList events={sortList} />
        </div>
        <div style={{ marginTop: "1rem" }}>
          <h4><b style={{ marginLeft: "2rem" }}>Popular:</b></h4><br></br>
          <EventList events={events} />
        </div>
      </main>
    </>
  )
}

export async function getServerSideProps() {
  try {
    const response = await fetch("http://localhost:3000/api/events");
    if (!response.ok) {
      throw new Error("Failed to fetch events");
    }
    const events = await response.json();
    let sortList = [...events]; // Create a copy of the events array

    sortList = sortList.sort((a, b) => new Date(a.dateString) - new Date(b.dateString));
    return {
      props: {
        events,
        sortList
      },
    };
  } catch (error) {
    console.error(error.message);
    return {
      props: {
        events: null,
        sortList
      },
    };
  }
}