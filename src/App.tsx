import {useImmer} from 'use-immer'
import React, {Fragment} from "react";
import wx from './assets/wx.jpg'


function Title({children}: { children: React.ReactNode }) {
    const width = window.innerWidth;
    return (
        <h1 className={`wx-title ${width > 1400 ? 'text-6xl' : 'text-5xl'}`}>{children}</h1>
    )
}

interface zfHistory {
    succCnt: number;
    failCnt: number;
}

const initHistory = {
    succCnt: 0,
    failCnt: 0,
}

interface historyMap {
    [zf: string]: zfHistory;
}

function History({history}: { history: historyMap }) {
    if (Object.entries(history).length > 0) {
        return (
            <div
                className="flex flex-col text-left text-xl text-sky-400 border-2 ml-8 border-emerald-300 rounded min-w-20">
                {Object.entries(history).map(([zf, h]: [string, zfHistory]) => {
                    const next = Number(zf) + 1;
                    return (<div className={`border border-emerald-300 py-2.5 px-6`}
                                 key={zf}>{`【${zf} ➡️ ${next}】: ${h.succCnt} / ${h.failCnt}`}</div>)
                })}
            </div>
        )
    } else {
        return (<div
            className={`flex flex-col text-left text-xl text-sky-400 border-2 ml-8 border-emerald-300 rounded p-6`}>没有数据</div>)
    }
}

function App() {
    const [zf, setZf] = useImmer<number>(0)
    const [state, setState] = useImmer<string>('')
    const [loading, setLoading] = useImmer<boolean>(false);
    const [history, setHistory] = useImmer<historyMap>({})

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

        setHistory(draft => {
            if (!draft[zf]) {
                draft[zf] = {...initHistory};
            }
        });

        if (judgeZengfu(zf)) {
            setHistory(draft => {
                draft[zf].succCnt += 1;
            });
            setZf(zf => zf + 1);
            setState('成功');
        } else {
            setHistory(draft => {
                draft[zf].failCnt += 1;
            });
            setZf(judgeDrop(zf));
            setState('失败');
        }

        setLoading(false);
    }

    return (
        <Fragment>
            <div className="w-screen h-screen bg-gray-900">
                <Title>吴翔翔的神秘增幅器</Title>
                <div className="flex items-center pr-16">
                    <History history={history}/>
                    <div className={`flex flex-col flex-auto items-center justify-center`}>
                        <div className="flex flex-auto items-center justify-center space-x-10 p-2">
                            <b className={`text-4xl flex-none
                ${zf < 3 ? 'text-white' : zf < 5 ? 'text-yellow-100' : zf < 9 ? 'text-yellow-200' : zf < 13 ? 'text-blue-400' : zf < 15 ? 'text-pink-300' : 'text-yellow-500'}`}>+{zf}吴翔翔</b>
                            <img height={200} width={200} src={wx}
                                 className={`wx w-52 h-52 items-center rounded-3xl flex-none
                     ${loading ? (zf < 10 ? 'animate-shake_low' : 'animate-shake_high') : ''}`} alt="wx logo"/>
                        </div>
                        <div className="flex flex-col items-center left-0 space-y-6 p-2">
                            <div
                                className={`text-center text-pink-300 text-xl`}>当前增幅成功率: {getProbability(zf) * 1.05 + 1 < 100 ? getProbability(zf) * 1.05 + 1 : 100}%
                            </div>
                            <div
                                className={"min-w-52 h-36 p-8 rounded-l text-center text-red-600 text-4xl flex-1"}>{state && `增幅${state}`}</div>
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
            </div>
        </Fragment>
    )
}

export default App
