
interface zfHistory {
    succCnt: number;
    failCnt: number;
}

export interface historyMap {
    [zf: string]: zfHistory;
}

export default function History({history}: { history: historyMap }) {
    if (Object.entries(history).length > 0) {
        return (
            <div
                className="history_list">
                {Object.entries(history).map(([zf, h]) => {
                    const next = Number(zf) + 1;
                    return (<div className={`border border-emerald-300 py-2.5 px-6`} key={zf}>
                        <span className={'text-sky-400'}>{`[${zf} ➡️ ${next}]: `}</span>
                        <span className={'text-green-400'}>{`${h.succCnt}`}</span>
                        <span className={'text-sky-400'}> / </span>
                        <span className={'text-red-500'}>{`${h.failCnt}`}</span>
                    </div>)
                })}
            </div>
        )
    } else {
        return (<div className={`history_list text-blue-300 py-2.5 px-6`}>
            <div>没有数据</div>
            <div>点击右侧开始增幅你的wxx！</div>
        </div>)
    }
}