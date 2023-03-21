import React,{useEffect,useState} from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import InfiniteScroll from "react-infinite-scroll-component";

const News = (props)=> {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  
  const capitalizeFirstLetter=(string) =>{
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

 const upadateNews = async () =>{
    props.setProgress(10);
    let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;
    setLoading (true)
    let data = await fetch(url);
    props.setProgress(30);
    let parsedData = await data.json()
    props.setProgress(50);
    setArticles(parsedData.articles)
    setTotalResults(parsedData.totalResults)
    setLoading(false)
    props.setProgress(100);
  }

useEffect(() => {
  document.title = `${ capitalizeFirstLetter(props.category)} - News Hub`;
    upadateNews();
},[]);

  const fetchMoreData = async () => {
    let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page+1}&pageSize=${props.pageSize}`;
    setPage(page + 1)
    let data = await fetch(url);
    let parsedData = await data.json()
        setArticles(articles.concat(parsedData.articles))
        setTotalResults(parsedData.totalResults)
  };

  
    return (
      <>
        <h1 className="text-center" style={{ margin: '35px 0px', marginTop: '90px' }}>
          NewsHub - Top {capitalizeFirstLetter(props.category)}{" "}
          Headlines
        </h1>
        {loading && <Spinner/>}

        <InfiniteScroll
          dataLength={articles.length}
          next={fetchMoreData}
          hasMore={articles.length !== totalResults}
          loader={<Spinner />}
        > 
          <div className="container">
            <div className="row">
              {articles.map((element) => {
                return (
                  <div className="col-md-4" key={element.url}>
                    <NewsItem
                      title={element.title ? element.title : ""}
                      description={
                        element.description ? element.description : ""
                      }
                      imageUrl={
                        element.urlToImage
                          ? element.urlToImage
                          : "https://bsmedia.business-standard.com/_media/bs/img/misc/2020-12/22/full/stock-broker-1608620310-52982820.png?im=Resize,width=620"
                      }
                      newsUrl={element.url}
                      date={element.publishedAt}
                      Auther={element.author}
                      source={element.source.name}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </InfiniteScroll>
      </>
    );
  }

  export default News;