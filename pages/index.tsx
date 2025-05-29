import Head from 'next/head';
import DiagnosisGame from '../components/DiagnosisGame';

export default function Home() {
  return (
    <>
      <Head>
        <title>Character Trait Quiz</title>
      </Head>
      <main>
        <DiagnosisGame />
      </main>
    </>
  );
}
