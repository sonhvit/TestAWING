import { useState, useEffect } from "react";
import axios from "axios";
import "./index.scss";
import HightlightText from "./HightlightText";

type typeData = {
  name: string;
  url: string;
};

function App() {
  const [data, setData] = useState<typeData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");

  const fetchData = async () => {
    try {
      const res = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=20");
      setData(res?.data?.results);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e?.target?.value);
  };

  const filterData = data.filter((item) =>
    item.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())
  );

  return (
    <div className="wrappage">
      <input
        type="text"
        placeholder="Tìm kiếm..."
        onChange={handleChangeInput}
      />

      {loading ? (
        "loading..."
      ) : (
        <table>
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên pokemon</th>
            </tr>
          </thead>
          <tbody>
            {filterData?.map((item: typeData, index: number) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>
                  <HightlightText text={item?.name} searched={search} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
