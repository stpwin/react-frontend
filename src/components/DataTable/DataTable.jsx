import React, { Component } from "react";

import config from "../../config";
import { authHeader, handleFetchError, addressToString } from "../../helpers";

import {
  Table,
  InputGroup,
  FormControl,
  Row,
  Col,
  Form,
  Pagination,
  Button,
  Dropdown
} from "react-bootstrap";
import { FaSearch, FaTimes } from "react-icons/fa";

export class DataTable extends Component {
  state = {
    pageNo: 1,
    maxPage: 50,
    customers: [],
    customerTranslate: [],
    filterText: ""
  };

  handlePageChangePrev = event => {
    this.setState({
      pageNo: this.state.pageNo - 1
    });
  };

  handlePageChangeNext = event => {
    this.setState({
      pageNo: this.state.pageNo + 1
    });
  };

  handlePageChange = event => {
    if (!event.target.text) return;

    const pageNo = parseInt(event.target.text);

    if (pageNo) {
      this.setState({
        pageNo: pageNo
      });
    }
  };

  handleFilterTextChange = event => {
    this.setState({
      filterText: event.target.value
    });
  };

  clearFilterText = () => {
    this.setState({
      filterText: ""
    });
  };

  render() {
    // console.log(this.props);
    const { customerTranslate, filterText, pageNo, maxPage } = this.state;
    const { filterPlaceholder, columns, rows } = this.props;
    return (
      <div className='data-table'>
        <Row>
          <Col />
          <Col />
          <Col className='text-right align-self-center'>
            <Dropdown id='dropdown-item-button justify-content-end'>
              <Dropdown.Toggle variant='outline-secondary' id='dropdown-basic'>
                20
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item href='#/action-1'>20</Dropdown.Item>
                <Dropdown.Item href='#/action-2'>100</Dropdown.Item>
                <Dropdown.Item href='#/action-3'>500</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </Row>

        <Row className='filterRow'>
          <Col className='align-self-center'>
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text id='inputGroup-sizing-sm'>
                  <FaSearch />
                </InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                aria-label='Small'
                aria-describedby='inputGroup-sizing-sm'
                placeholder={filterPlaceholder}
                onChange={this.handleFilterTextChange}
                value={filterText}
              />
              {filterText.length > 0 ? (
                <InputGroup.Append>
                  <Button
                    variant='outline-secondary'
                    onClick={this.clearFilterText}
                  >
                    <FaTimes />
                  </Button>
                </InputGroup.Append>
              ) : null}
            </InputGroup>
          </Col>
          <Col className='align-self-center'>
            <Form.Check custom inline label='G1' id='inline-1' />
            <Form.Check custom inline label='G2' id='inline-2' />
          </Col>
          <Col className='text-right align-self-center'>
            {/* <Paginator curPage={1} maxPage={10} /> */}
          </Col>
        </Row>

        <Table striped responsive bordered hover size='sm'>
          <thead className='text-center thread-pea'>
            <tr>
              {columns &&
                columns.map(col => {
                  return <th className='align-middle'>{col.text}</th>;
                })}
            </tr>
          </thead>
          <tbody>
            {rows ? (
              rows.map(data => {
                return (
                  <tr>
                    {columns &&
                      columns.map(col => {
                        return (
                          <td
                            className={`align-middle ${
                              col.valign === "true" ? "text-center" : null
                            }`}
                          >
                            {data[col.dataField]}
                          </td>
                        );
                      })}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  className='text-center align-middle'
                  colSpan={columns.length}
                >
                  ไม่มีข้อมูล
                </td>
              </tr>
            )}
          </tbody>
        </Table>
        <Row>
          <Col />
          <Col />
          <Col>
            <Paginator
              curPage={pageNo}
              maxPage={maxPage}
              pageChange={this.handlePageChange}
              pageChangePrev={this.handlePageChangePrev}
              pageChangeNext={this.handlePageChangeNext}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

const Paginator = ({
  curPage,
  maxPage,
  pageChange,
  pageChangePrev,
  pageChangeNext
}) => {
  const middle = [];
  if (maxPage <= 7) {
    for (let i = 3; i < maxPage; i++) {
      middle.push(i);
    }
  } else {
    const x = maxPage - 2;

    if (x === curPage) {
      middle.push(x - 2);
    } else if (curPage - x === 1) {
      middle.push(x - 2);
      middle.push(x - 1);
    } else if (curPage - x === 2) {
      middle.push(x - 2);
      middle.push(x - 1);
      middle.push(x);
    }

    for (let i = 3; i <= x; i++) {
      if (curPage === i || curPage - 1 === i || curPage + 1 === i) {
        middle.push(i);
      }
    }
    if (curPage === 1) {
      middle.push(3);
      middle.push(4);
      middle.push(5);
    } else if (curPage === 2) {
      middle.push(4);
      middle.push(5);
    } else if (curPage === 3) {
      middle.push(5);
    }
  }

  return (
    <Pagination className='justify-content-end' onClick={pageChange}>
      <Pagination.Prev disabled={curPage === 1} onClick={pageChangePrev} />
      <Pagination.Item active={curPage === 1}>{1}</Pagination.Item>

      {curPage <= 4 || maxPage <= 7 ? (
        <Pagination.Item active={curPage === 2}>{2}</Pagination.Item>
      ) : (
        <Pagination.Ellipsis disabled />
      )}

      {middle.map(pageNo => {
        return (
          <Pagination.Item active={curPage === pageNo}>
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

      <Pagination.Item
        active={curPage === maxPage}
      >{`${maxPage}`}</Pagination.Item>
      <Pagination.Next
        disabled={curPage === maxPage}
        onClick={pageChangeNext}
      />
    </Pagination>
  );
};

function mapStateToProps(state) {
  const { authentication } = state;
  const { user } = authentication;
  return {
    user
  };
}

export default DataTable;
