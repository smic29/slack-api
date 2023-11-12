import './Loading.css'

function Loading() {
    return (
    <span class="material-symbols-outlined rotate">
        refresh
    </span>
    )
}

export function LoadingLine() {
    return (
        <div className='loading-container'>
        <div className='loading-line'></div>
        </div>
    )
}

export default Loading;