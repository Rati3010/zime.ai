import { useEffect, useState } from "react";
import { Input, Table, Tag } from "antd";
import "./App.css";
import { fetchData } from "./utils";
import Column from "antd/es/table/Column";
import { useSearchParams } from 'react-router-dom';

function App() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [totalPage, setTotalPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const getData = async () => {
      const data = await fetchData();
      if (data) {
        setPosts(data.posts);
        setFilteredPosts(data.posts)
        setTotalPage(data.posts.length)
      }
    };
    getData();
  }, []);
  const handleTagFilter = (selectedTags) => {
    if (selectedTags.length === 0) {
      setFilteredPosts(posts);
      setTotalPage(posts.length)
    } else {
      const filtered = posts.filter((post) =>
        selectedTags.every((tag) => post.tags.includes(tag))
      );
      setFilteredPosts(filtered);
      setTotalPage(filtered.length)
    }
  };
  const handleSearch = (e) => {
    const { value } = e.target;
    setSearchTerm(value);
    const filteredData = posts.filter((post) =>
      post.body.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredPosts(filteredData);
    setTotalPage(filteredData.length);
  };
  return (
    <>
    <Input
        placeholder="Search Body"
        value={searchTerm}
        onChange={handleSearch}
        style={{ marginBottom: 16 }}
      />
      {posts && (
        <Table
          dataSource={filteredPosts}
          pagination={{ pageSize: 10, total: totalPage }}
        >
          <Column title="Title" dataIndex={"title"} key={"title"} />
          <Column title="Body" dataIndex={"body"} key={"body"} 
           render={(text) => {
            const highlightedText = text.replace(
              new RegExp(searchTerm, "gi"),
              (match) => `<span class="highlight">${match}</span>`
            );
            return <div dangerouslySetInnerHTML={{ __html: highlightedText }} />;
          }}/>
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
            onChange={handleTagFilter}
          />
        </Table>
      )}
    </>
  );
}

export default App;
