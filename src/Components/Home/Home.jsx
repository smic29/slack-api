import { useData } from "../../Context/DataProvider"

function Home() {
    const { user } = useData();

    return (
        <div>
            <h1>Welcome to your home page, {user.username}!</h1>
        </div>
    )
}

export default Home