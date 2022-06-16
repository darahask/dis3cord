import { ethers } from "ethers";

export default function Search({ props }) {
    let { totalDaos, daos, setDaos } = props;

    function handleChange(e) {
        let changedDaos = totalDaos.current.filter((val) => {
            let searchString = val.name.trim();
            +" " + ethers.utils.formatEther(val.price.toString()).trim();
            +" " + val.description.trim();
            +" " + val.address.trim();
            searchString = searchString.toLowerCase();

            if (searchString.includes(e.target.value.trim().toLowerCase()))
                return true;
            return false;
        });
        setDaos(changedDaos);
    }

    return (
        <div className="w-full flex justify-center">
            <input
                className="mt-4 rounded border border-black p-1 w-1/3"
                type="text"
                onChange={handleChange}
                placeholder="Seach Daos"
            ></input>
        </div>
    );
}
