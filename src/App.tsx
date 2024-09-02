import {useImmer} from 'use-immer'
import React, {Fragment} from "react";
import wx from './assets/wx.jpg'


function Title({children}: {children: React.ReactNode}) {
    const width = window.innerWidth;
    return (
        <h1 className={`wx-title ${width > 1400? 'text-6xl' : 'text-5xl'}`}>{children}</h1>
    )
}

interface zfHistory {
    zf: number;
    succCnt: number;
    failCnt: number;
}

function History({history}: {history: Array<zfHistory>}) {
    return (
        <div className="flex flex-col">
            {history.map(history => (
                <div key={history.zf}>{history.zf} {'>'} {history.zf + 1}: {history.succCnt}/{history.failCnt}</div>
            ))}
        </div>
    )
}

function App() {
    const [zf, setZf] = useImmer(0)
    const [state, setState] = useImmer('')
    const [loading, setLoading] = useImmer(false);
    const [, setCount] = useImmer(0)
    const [history, setHistory] = useImmer([])
    // const [highest, setHighest] = useImmer(0)

    const probability: Record<number, number> = {
        0: 100,
        1: 100,
        2: 100,
        3: 100,
        4: 80,
        5: 70,
        6: 60,
        7: 70,
        8: 60,
        9: 50,
        10: 40,
        11: 30,
        12: 20,
    }

    const getProbability = (zf: number): number => {
        if (zf < 13) return probability[zf];
        else return 20;
    }

    const getRandomInt = (min: number, max: number): number => {
        return Math.floor(Math.random() * (max - min)) + min;
    };

    const judgeZengfu = (zf: number): boolean => {
        return getProbability(zf) * 1.05 + 1 > getRandomInt(0, 99);
    }

    const judgeDrop = (zf: number): number => {
        if (zf < 5) return zf;
        else if (zf < 7) return zf - 1;
        else if (zf < 10) return zf - 3;
        else return 0;
    }

    const chong = async () => {
        setLoading(true);
        let t = 1500;
        if (zf < 10) {
            t = 500
        }
        await new Promise(resolve => setTimeout(resolve, t));

        setCount((c) => c + 1);
        if (judgeZengfu(zf)) {
            setZf((count) => count + 1)
            setState('成功')
        } else {
            setZf(judgeDrop(zf))
            setState('失败')
        }

        setLoading(false);
    }

    return (
        <Fragment>
            <div className="w-screen h-screen bg-gray-900 top-0">
                <Title>吴翔翔的神秘增幅器</Title>
                <div className="flex items-center justify-center space-x-20 p-2">
                    <History history={history} />
                    <div className="flex items-center justify-center space-x-20 p-2">
                        <b className={`text-4xl flex-none
                ${zf < 3 ? 'text-white' : zf < 5 ? 'text-yellow-100' : zf < 9 ? 'text-yellow-200' : zf < 13 ? 'text-blue-400' : zf < 15 ? 'text-pink-300' : 'text-yellow-500'}`}>+{zf}吴翔翔</b>
                        <img height={200} width={200} src={wx}
                             className={`wx w-52 h-52 rounded-3xl flex-none
                     ${loading ? (zf < 10 ? 'animate-shake_low' : 'animate-shake_high') : ''}`} alt="wx logo"/>
                    </div>
                    <div className="flex flex-col items-center justify-center space-y-10 p-2">
                        <div
                            className={`text-center text-pink-300 text-xl`}>当前增幅成功率: {getProbability(zf) * 1.05 + 1 < 100 ? getProbability(zf) * 1.05 + 1 : 100}%
                        </div>
                        <div
                            className={"w-52 h-36 p-5 rounded-l text-center text-red-600 text-4xl m-6 flex-1"}>{state && `增幅${state}`}</div>
                        <button onClick={chong}
                                className={`w-32 h-14  text-center text-xl transition-transform border-dotted rounded-xl ${
                                    loading
                                        ? 'bg-gray-400 text-white cursor-not-allowed opacity-80'
                                        : 'bg-blue-400 text-white hover:scale-125 border-b-blue-800'
                                }`}
                                disabled={loading}>
                            {loading ? '增幅中...' : '增幅'}
                        </button>
                    </div>
                </div>
            </div>
        </Fragment>
)
}

export default App
