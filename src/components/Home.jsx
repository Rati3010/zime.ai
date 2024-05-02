import { useEffect, useState } from "react";
import { Input, Table, Tag } from "antd";
import "../App.css";
import { fetchData } from "../utils";
import Column from "antd/es/table/Column";
import { useLocation, useNavigate } from "react-router-dom";

function Home() {
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState([]);
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [totalPage, setTotalPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const page = parseInt(params.get("page")) || 1;
    const pageSize = parseInt(params.get("pageSize")) || 10;
    const filterParams = params.getAll("filter");
    setFilters(filterParams);
    const searchParam = params.get("search") || "";
    setSearchTerm(searchParam);
    setPagination({ page, pageSize });
    const getData = async () => {
      const data = await fetchData();
      if (data) {
        console.log(data)
        setPosts(data.posts);
        setFilteredPosts(data.posts);
        setTotalPage(data.posts.length);
      }
    };
    getData();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (pagination.page) params.set("page", pagination.page);
    if (pagination.pageSize) params.set("pageSize", pagination.pageSize);
    filters.forEach((filter) => params.append("filter", filter));
    if (searchTerm) params.set("search", searchTerm);
    navigate({
      pathname: location.pathname,
      search: `?${params.toString()}`,
    });
  }, [pagination, filters, searchTerm, history]);

  const handleSearch = (e) => {
    const { value } = e.target;
    setSearchTerm(value);
    const filteredData = posts.filter((post) =>
      post.body.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredPosts(filteredData);
    setTotalPage(filteredData.length);
  };
  const handlePaginationChange = (page, pageSize) => {
    console.log(page, pageSize);
    setPagination({ page, pageSize });
    const params = new URLSearchParams(location.search);
    params.set("page", page.toString());
    navigate(`?${params.toString()}`);
  };
  return (
    <>
      <div className="top_bar">
        <h2>Zime.AI</h2>
      </div>
      <Input
        placeholder="Search Body"
        value={searchTerm}
        onChange={handleSearch}
        style={{ marginBottom: 16 }}
      />
      {posts && (
        <Table
          dataSource={filteredPosts}
          pagination={{
            pageSize: 10,
            total: totalPage,
            current: pagination.page,
            onChange: handlePaginationChange,
          }}
        >
          <Column title="Title" dataIndex={"title"} key={"title"} />
          <Column
            title="Body"
            dataIndex={"body"}
            key={"body"}
            render={(text) => {
              const highlightedText = text.replace(
                new RegExp(searchTerm, "gi"),
                (match) => `<span class="highlight">${match}</span>`
              );
              return (
                <div dangerouslySetInnerHTML={{ __html: highlightedText }} />
              );
            }}
          />
          <Column title="Reaction" dataIndex={"reactions"} key={"reactions"} />
          <Column
            title="Tags"
            dataIndex={"tags"}
            key={"tags"}
            filters={[
              { text: "History", value: "history" },
              { text: "American", value: "american" },
              { text: "Crime", value: "crime" },
              { text: "French", value: "french" },
              { text: "Fiction", value: "fiction" },
              { text: "English", value: "english" },
              { text: "Magical", value: "magical" },
              { text: "Mystery", value: "mystery" },
              { text: "Love", value: "love" },
              { text: "Classic", value: "classic" },
            ]}
            onFilter={(value, record) => record.tags.includes(value)}
            render={(tags) => (
              <>
                {tags.map((tag) => {
                  return <Tag key={tag}>{tag.toUpperCase()}</Tag>;
                })}
              </>
            )}
            filterMultiple={true}
          />
        </Table>
      )}
    </>
  );
}

export default Home;
