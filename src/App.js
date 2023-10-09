import "./App.css";
import { useEffect, useState } from "react";
import Data from "./datajson/Data.json";
import { BiChevronDown } from "react-icons/bi";
import { useSearchParams } from "react-router-dom";

function App() {
  const [user, setuser] = useState(Data);
  const [params, setParams] = useSearchParams();
  const [hoveredHeading, setHoveredHeading] = useState(null);
  const name = params.get("sort");
  const sortName = name?.split("%")?.[0];
  const showIconHover = (index) => {
    setHoveredHeading(index);
  };

  const hideIconHover = () => {
    setHoveredHeading(null);
  };

  const getClassName = (index, sortname) => {
    return hoveredHeading === index || sortName === sortname  ? "showicon" : "hide";
  };

  const sorthandle = (values, order) => {
    if (!name || (name && name !== values && name !== `${values}%3Adesc`)) {
      setParams({ sort: values });
    } else if (name && values === name && name !== `${values}%3Adesc`) {
      setParams({ sort: `${values}%3Adesc` });
    } else {
      setParams({});
    }
  };

  const sortFunction = (Name) => {
    const dynamicsort = [...user];
    console.log(Name, "shortname");
    if (name && !name.includes("%3Adesc")) {
      name !== "dial_code"
        ? dynamicsort.sort((a, b) => a[sortName]?.localeCompare(b[sortName]))
        : dynamicsort.sort(
            (a, b) => parseInt(a[sortName]) - parseInt(b[sortName])
          );
    } else if (name && name.includes("%3Adesc")) {
      if (sortName === "dial_code") {
        dynamicsort.sort(
          (a, b) => parseInt(b[sortName]) - parseInt(a[sortName])
        );
      } else {
        dynamicsort.sort((a, b) => b[sortName]?.localeCompare(a[sortName]));
        // dynamicsort.sort((a, b) => b.dial_code.localeCompare(a.dial_code));
      }
    }
    setuser(name ? dynamicsort : Data);
  };

  useEffect(() => {
    sortFunction(name);
  }, [name]);

  return (
    <div>
      <table id="myTable">
        <tr>
          <th onMouseOver={() => showIconHover(1)} onMouseOut={hideIconHover}>
            Name{" "}
            <span
              className={getClassName(1, "name")}
              onClick={() => sorthandle("name", "asc")}
            >
              <BiChevronDown size={20}/>
            </span>
          </th>
          <th onMouseOver={() => showIconHover(2)} onMouseOut={hideIconHover}>
            Dial Code{" "}
            <span
              className={getClassName(2, "dial_code")}
              onClick={() => sorthandle("dial_code", "asc")}
            >
              <BiChevronDown />
            </span>
          </th>
          <th onMouseOver={() => showIconHover(3)} onMouseOut={hideIconHover}>
            Code Fields{" "}
            <span
              className={getClassName(3, "code")}
              onClick={() => sorthandle("code", "asc")}
            >
              <BiChevronDown  />
            </span>
          </th>
        </tr>
        {user?.map((item, index) => (
          <tr key={index}>
            <td>{item.name} </td>
            <td>{item?.dial_code}</td>
            <td>{item?.code}</td>
          </tr>
        ))}
      </table>
    </div>
  );
}

export default App;
