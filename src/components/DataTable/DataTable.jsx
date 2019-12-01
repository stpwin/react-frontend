import React, { Component } from "react";

import {
  Table,
  InputGroup,
  FormControl,
  Row,
  Col,
  Form,
  Pagination,
  Button,
  Dropdown,
  ButtonToolbar,
  OverlayTrigger,
  Tooltip
} from "react-bootstrap";
import { FaSearch, FaTimes, FaSlidersH, FaCheck, FaEdit } from "react-icons/fa";

export class DataTable extends Component {
  state = {
    filterText: ""
  };

  handleFilterTextChange = event => {
    this.setState({
      filterText: event.target.value
    });
    this.props.filterTextChange(event.target.value);
  };

  clearFilterText = () => {
    this.setState({
      filterText: ""
    });
  };

  render() {
    // console.log(this.props);
    const { filterText } = this.state;
    const {
      filterPlaceholder,
      columns,
      data,
      pageNo,
      maxPage,
      onNextPage,
      onPrevPage,
      onPageChange,
      onPerPageChange,
      perPage,
      filters,
      filterChecked,
      onFilterCheckedChange
    } = this.props;
    return (
      <div className='data-table'>
        <Row>
          <Col />
          <Col />
          <Col className='text-right align-self-center'>
            <Dropdown
              id='dropdown-item-button justify-content-end'
              onSelect={onPerPageChange}
            >
              <Dropdown.Toggle variant='outline-secondary' id='dropdown-basic'>
                {perPage}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item eventKey={50}>50</Dropdown.Item>
                <Dropdown.Item eventKey={100}>100</Dropdown.Item>
                <Dropdown.Item eventKey={500}>500</Dropdown.Item>
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
            {filters &&
              filters.map((filter, index) => {
                return (
                  <Form.Check
                    custom
                    inline
                    name={`filter-${index}`}
                    label={filter.text}
                    checked={filterChecked[index]}
                    onChange={onFilterCheckedChange}
                    id={`filter-${index}`}
                  />
                );
              })}
            {/* <Form.Check custom inline label='G1' id='inline-1' />
            <Form.Check custom inline label='G2' id='inline-2' /> */}
          </Col>
          <Col className='text-right align-self-center'>
            <Paginator
              curPage={pageNo}
              maxPage={maxPage}
              pageChange={onPageChange}
              pageChangePrev={onPrevPage}
              pageChangeNext={onNextPage}
            />
          </Col>
        </Row>

        <Table striped responsive bordered hover size='sm'>
          <thead className='text-center thread-pea'>
            <tr>
              {columns &&
                columns.map(col => {
                  return <th className='align-middle'>{col.text}</th>;
                })}
              <th className='align-middle'>
                <FaSlidersH />
              </th>
            </tr>
          </thead>
          <tbody>
            {data ? (
              data.map(data => {
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
                    <td className='align-middle text-center td-tools-button'>
                      <ButtonToolbar aria-label='Toolbar with button groups'>
                        <OverlayTrigger
                          key='verify'
                          placement='top'
                          overlay={
                            <Tooltip id={`tooltip-verify`}>
                              ยืนยันสิทธิ์
                            </Tooltip>
                          }
                        >
                          <Button variant='outline-success' size='sm'>
                            <FaCheck />
                          </Button>
                        </OverlayTrigger>

                        <OverlayTrigger
                          key='verify'
                          placement='top'
                          overlay={
                            <Tooltip id={`tooltip-verify`}>แก้ไขข้อมูล</Tooltip>
                          }
                        >
                          <Button size='sm' variant='outline-info'>
                            <FaEdit />
                          </Button>
                        </OverlayTrigger>

                        <OverlayTrigger
                          key='verify'
                          placement='top'
                          overlay={<Tooltip id={`tooltip-verify`}>ลบ</Tooltip>}
                        >
                          <Button variant='outline-danger' size='sm'>
                            <FaTimes />
                          </Button>
                        </OverlayTrigger>
                      </ButtonToolbar>
                    </td>
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
              pageChange={onPageChange}
              pageChangePrev={onPrevPage}
              pageChangeNext={onNextPage}
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
      // console.log("a", x - 2);
    }
    // else if (curPage - x === 1) {
    //   middle.push(x - 2);
    //   middle.push(x - 1);
    // } else if (curPage - x === 2) {
    //   middle.push(x - 2);
    //   middle.push(x - 1);
    //   middle.push(x);
    // }

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
        // console.log("e", i);
      }
    }
    // console.log("-------------------------");
    // if (curPage === 1) {
    //   middle.push(3);
    //   middle.push(4);
    //   middle.push(5);
    // } else if (curPage === 2) {
    //   middle.push(4);
    //   middle.push(5);
    // } else if (curPage === 3) {
    //   middle.push(5);
    // }
  }

  return (
    <Pagination className='justify-content-end' onClick={pageChange}>
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

      {maxPage > 2 ? (
        <Pagination.Item
          active={curPage === maxPage}
        >{`${maxPage}`}</Pagination.Item>
      ) : null}

      <Pagination.Next
        disabled={curPage === maxPage}
        onClick={pageChangeNext}
      />
    </Pagination>
  );
};

export default DataTable;
