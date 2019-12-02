import React, { Component } from "react";

import { Pagination } from "react-bootstrap";

export class Paginator extends Component {
  render() {
    const {
      curPage,
      maxPage,
      pageChange,
      pageChangePrev,
      pageChangeNext
    } = this.props;
    const middle = [];
    if (maxPage <= 7) {
      for (let i = 3; i < maxPage; i++) {
        middle.push(i);
      }
    } else {
      const x = maxPage - 2;

      if (x === curPage) {
        middle.push(x - 2);
        // console.log("a", x - 2);
      }

      for (let i = 3; i <= x; i++) {
        if (i <= 5 && curPage < 5) {
          // console.log("b", i);
          middle.push(i);
        }

        if (curPage === maxPage && i === maxPage - 4) {
          // console.log("c", i);
          middle.push(i);
        }

        if (curPage > x && (curPage - 3 === i || curPage - 2 === i)) {
          // console.log("d", i);
          middle.push(i);
        }
        if (
          curPage > 4 &&
          (curPage === i || curPage - 1 === i || curPage + 1 === i)
        ) {
          middle.push(i);
        }
      }
    }

    return (
      <Pagination className="justify-content-end" onClick={pageChange}>
        <Pagination.Prev disabled={curPage === 1} onClick={pageChangePrev} />
        <Pagination.Item active={curPage === 1}>{1}</Pagination.Item>

        {curPage <= 4 || maxPage <= 7 ? (
          maxPage > 1 ? (
            <Pagination.Item active={curPage === 2}>{2}</Pagination.Item>
          ) : null
        ) : (
          <Pagination.Ellipsis disabled />
        )}

        {middle.map(pageNo => {
          return (
            <Pagination.Item key={`page-${pageNo}`} active={curPage === pageNo}>
              {pageNo}
            </Pagination.Item>
          );
        })}

        {maxPage > 7 ? (
          curPage >= maxPage - 3 ? (
            <Pagination.Item active={curPage === maxPage - 1}>
              {maxPage - 1}
            </Pagination.Item>
          ) : (
            <Pagination.Ellipsis disabled />
          )
        ) : null}

        {maxPage > 2 ? (
          <Pagination.Item
            active={curPage === maxPage}
          >{`${maxPage}`}</Pagination.Item>
        ) : null}

        <Pagination.Next
          disabled={curPage === maxPage || maxPage === 0}
          onClick={pageChangeNext}
        />
      </Pagination>
    );
  }
}

export default Paginator;
