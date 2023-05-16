import React, { useState } from "react";
import Card from "../components/card";
import Guides from "../infrastructure/dummy.json";
import { WalletChatWidget } from "react-wallet-chat-v0";

import "react-wallet-chat-v0/dist/index.css";
import styles from "./app.module.css";

const OWNER = "0x05b2DCeDEe832Ba4ae7631cD1fF6E5Fc2c88037C";

const App = (): JSX.Element => {
  const [guides, setGuides] = useState(Guides);
  const [text, setText] = useState("");
  const [filters, setFilters] = useState({ latest: false, free: false });
  const [widgetState, setWidgetState] = useState({
    chatAddr: "",
    isOpen: false,
  });

  const filterFree = () => {
    if (filters.free) {
      setFilters({ ...filters, free: false });
      setGuides(Guides);
    } else {
      setFilters({ ...filters, free: true });
      const newGuides = Guides.filter(
        (i) => i.type === "free" || i.type === "Free"
      );
      setGuides(newGuides);
    }
  };

  const filterLatest = () => {
    if (filters.latest) {
      setFilters({ ...filters, latest: false });
      setGuides(Guides);
    } else {
      setFilters({ ...filters, latest: true });
      const newGuides = Guides.map((i) => {
        const t = i.time;
        return {
          ...i,
          date: new Date(`${t[0]}${t[1]}-${t[2]}${t[3]}-${t[4]}${t[5]}`),
        };
      }).sort((a, b) => b.date.getTime() - a.date.getTime());
      setGuides(newGuides);
    }
  };

  const filterText = () => {
    if (text) {
      const newGuides = Guides.filter((i) =>
        i.regions.some((region) =>
          text.toLowerCase().includes(region.toLowerCase())
        )
      );
      setGuides(newGuides);
    }
  };

  const randomizeGuide = () => {
    const length = Guides.length;
    const randint = Math.floor(Math.random() * length);
    setGuides([Guides[randint]]);
  };

  return (
    <main className={styles.main}>
      <header className="pt-12 z-10 relative w-full sm:mx-16 flex flex-col items-center">
        <h1 className="text-xl sm:text-3xl text-center lg:text-5xl w-full leading-none font-extrabold tracking-tight  mb-8 sm:mb-10 text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-purple-800">
          Welcome to The Decentralized Travel Agency
        </h1>
        <h3 className="text-xs sm:text-base w-[50%] text-center leading-none font-bold tracking-tight mb-8 sm:mb-10 text-white">
          AnonVeil is here is help you access free and premium travel guides for
          your desired location, to help guide you on must-go places, do's and
          don'ts, cultures and traiditions, etc
        </h3>
      </header>
      <section className="sm:mx-12 flex-col flex items-center w-full">
        <div className="flex sm:flex-row flex-col p-6 w-full flex-wrap">
          <input
            onChange={(e) => setText(e.target.value)}
            className="rounded-lg bg-transparent text-white caret-gray-900 w-[100%] sm:w-[80%] sm:mr-2 border border-primary h-10 p-4 text-xl"
            placeholder="I want to visit Lagos, Nigeria"
          />{" "}
          <button
            onClick={filterText}
            className="button button-primary py-2 px-4 bg-blue-500 mt-4 sm:mt-0 text-white rounded-lg text-center gap-2 ml-6 shadow-xl"
          >
            Search
          </button>
        </div>
        <div className="flex w-full sm:w-[50%] items-center justify-around">
          <button
            className={
              filters.free ? styles.appliedButton : styles.unappliedButton
            }
            onClick={filterFree}
          >
            Free
          </button>
          <button
            className={
              filters.latest ? styles.appliedButton : styles.unappliedButton
            }
            onClick={filterLatest}
          >
            Latest
          </button>
          <button className={styles.unappliedButton} onClick={randomizeGuide}>
            Randomize
          </button>
        </div>
      </section>
      <section className="max-w-screen-lg xl:max-w-screen-xl mx-auto grid grid-cols-10 gap-4 p-4">
        {guides.map((props, index) => (
          <div
            key={index}
            className={styles.cardWrapper}
            style={{ animationDelay: `${index * 0.1 + 0.1}s` }}
          >
            <Card
              title={props.name}
              description={props.description}
              amount={props.type}
              address={props.address}
              setWidgetState={setWidgetState}
            />
          </div>
        ))}
      </section>
      <WalletChatWidget widgetState={widgetState} />
      <footer className="pb-16 w-screen-lg xl:max-w-screen-xl mx-auto text-center sm:text-right text-gray-400 font-bold">
        <a href="https://github.com/agbanusi">
          John Agbanusi @ {new Date().getFullYear()}
        </a>
        <button
          onClick={() => setWidgetState({ isOpen: true, chatAddr: OWNER })}
          className="text-white bg-transparent border border-blue-500 rounded p-2  ml-4"
        >
          Chat with Owner
        </button>
      </footer>
    </main>
  );
};

export default App;
