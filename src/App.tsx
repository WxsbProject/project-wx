import {useImmer} from 'use-immer'
import React, {Fragment} from "react";
import wx from './assets/wx.jpg'
import History, {historyMap} from "./history_list.tsx";


function Title({children}: { children: React.ReactNode }) {
    const width = window.innerWidth;
    return (
        <h1 className={`wx-title ${width > 1400 ? 'text-6xl' : 'text-5xl'}`}>{children}</h1>
    )
}

const buffs: Record<string, (i: number) => number> = {
    'none': (i: number) => i,
    'dnf-standard': (i: number) => i * 1.05 + 1,
    'wxx-buff': (i: number) => i * 1.2 + 1,
    'fuck': (i: number) => i * 1.5 + 5,
}

interface buffStruct {
    name: string,
    func: (i: number) => number,
}

function App() {
    const [zf, setZf] = useImmer<number>(0)
    const [state, setState] = useImmer<string>('')
    const [loading, setLoading] = useImmer<boolean>(false);
    const [history, setHistory] = useImmer<historyMap>({})
    const [buff, setBuff] = useImmer<buffStruct>({name: 'none', func: buffs['none']})

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
        return buff.func(getProbability(zf)) > getRandomInt(0, 99);
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
                draft[zf] = {succCnt: 0, failCnt: 0,};
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

    const handleBuffChange = (name: string) => {
        const confirm = window.confirm('切换buff会重置增幅数据!')
        if (confirm) {
            setBuff(draft => {
                const b = buffs[name];
                draft.name = name;
                draft.func = b;
            })
            setState('')
            setHistory({})
            setZf(0)
        }
    }

    return (
        <Fragment>
            <div className="w-screen h-screen bg-gray-900">
                <Title>吴翔翔的神秘增幅器</Title>
                <div className="flex items-start justify-center h-screen">
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
                                className={`text-center text-pink-300 text-xl`}>当前增幅成功率: {buff.func(getProbability(zf)) < 100 ? buff.func(getProbability(zf)) : 100}%
                            </div>
                            <div
                                className={`${!state && 'invisible'} p-1 text-center text-red-600 text-4xl`}>{`增幅${state}`}</div>
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
                    <div className={`buff_list`}>
                        <h3 className={`text-xl`}>请选择一个Buff:</h3>
                        <label className={`buff_label`}>
                            <input
                                type="radio"
                                checked={buff.name === 'none'}
                                onChange={() => handleBuffChange('none')}
                            />
                            我是高手，不需要
                        </label>
                        <label className={`buff_label`}>
                            <input
                                type="radio"
                                checked={buff.name === 'dnf-standard'}
                                onChange={() => handleBuffChange('dnf-standard')}
                            />
                            普雷+增幅药
                        </label>
                        <label className={`buff_label`}>
                            <input
                                type="radio"
                                checked={buff.name === 'wxx-buff'}
                                onChange={() => handleBuffChange('wxx-buff')}
                            />
                            wxx的馈赠
                        </label>
                        <label className={`buff_label`}>
                            <input
                                type="radio"
                                checked={buff.name === 'fuck'}
                                onChange={() => handleBuffChange('fuck')}
                            />
                            我急了
                        </label>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default App
