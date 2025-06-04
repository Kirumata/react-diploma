export default function LoadMoreButton(props: { status: "show" | "hide" | "error" | "loading", onClick: () => void }) {
    switch (props.status) {
        case "show": {
            return <button className="btn btn-outline-primary" onClick={() => props.onClick()}>Загрузить ещё</button>
        }
        case "hide": {
            return <></>
        }
        case "loading": {
            return (
                <div className="preloader">
                    <span />
                    <span />
                    <span />
                    <span />
                </div>
            )
        }
        case "error":
            {
                return <p>Произошла ошибка!</p>
            }
    }
}