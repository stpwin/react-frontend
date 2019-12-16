import React, { Component } from "react";

import { Pagination } from "react-bootstrap";

export class Paginator extends Component {
  render() {
    const {
      page,
      pages,
      pageChange,
      pageChangePrev,
      pageChangeNext
    } = this.props;
    const middle = [];
    if (pages <= 7) {
      for (let i = 3; i < pages; i++) {
        middle.push(i);
      }
    } else {
      const x = pages - 2;

      if (x === page) {
        middle.push(x - 2);
        // console.log("a", x - 2);
      }

      for (let i = 3; i <= x; i++) {
        if (i <= 5 && page < 5) {
          // console.log("b", i);
          middle.push(i);
        }

        if (page === pages && i === pages - 4) {
          // console.log("c", i);
          middle.push(i);
        }

        if (page > x && (page - 3 === i || page - 2 === i)) {
          // console.log("d", i);
          middle.push(i);
        }
        if (page > 4 && (page === i || page - 1 === i || page + 1 === i)) {
          middle.push(i);
        }
      }
    }

    return (
      <Pagination className="justify-content-end" onClick={pageChange}>
        <Pagination.Prev disabled={page === 1} onClick={pageChangePrev} />
        <Pagination.Item active={page === 1}>{1}</Pagination.Item>

        {page <= 4 || pages <= 7 ? (
          pages > 1 ? (
            <Pagination.Item active={page === 2}>{2}</Pagination.Item>
          ) : null
        ) : (
          <Pagination.Ellipsis disabled />
        )}

        {middle.map(pageNo => {
          return (
            <Pagination.Item key={`page-${pageNo}`} active={page === pageNo}>
              {pageNo}
            </Pagination.Item>
          );
        })}

        {pages > 7 ? (
          page >= pages - 3 ? (
            <Pagination.Item active={page === pages - 1}>
              {pages - 1}
            </Pagination.Item>
          ) : (
            <Pagination.Ellipsis disabled />
          )
        ) : null}

        {pages > 2 ? (
          <Pagination.Item
            active={page === pages}
          >{`${pages}`}</Pagination.Item>
        ) : null}

        <Pagination.Next
          disabled={page === pages || pages === 0}
          onClick={pageChangeNext}
        />
      </Pagination>
    );
  }
}

export default Paginator;
