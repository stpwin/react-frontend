import React, { Component } from "react";

import {
  Table,
  InputGroup,
  FormControl,
  Row,
  Col,
  Form,
  Button,
  Dropdown,
  ButtonToolbar,
  OverlayTrigger,
  Tooltip
} from "react-bootstrap";

import "./table.css";

import { FaSearch, FaTimes, FaSlidersH, FaCheck, FaEdit } from "react-icons/fa";

import Highlight from "react-highlighter";

import Paginator from "./Paginator";

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
      onVerify,
      onEdit,
      onDelete,
      perPage,
      perPages,
      filters,
      filterChecked,
      onFilterCheckedChange
      // searchText
    } = this.props;
    return (
      <div className="data-table">
        <Row>
          <Col />
          <Col />
          <Col className="text-right align-self-center">
            {perPage ? (
              <Dropdown
                id="dropdown-item-button justify-content-end"
                onSelect={onPerPageChange}
              >
                <Dropdown.Toggle
                  variant="outline-secondary"
                  id="dropdown-basic"
                >
                  {perPage}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  {perPages &&
                    perPages.map((key, index) => {
                      return (
                        <Dropdown.Item key={`perPage-${index}`} eventKey={key}>
                          {key}
                        </Dropdown.Item>
                      );
                    })}
                </Dropdown.Menu>
              </Dropdown>
            ) : null}
          </Col>
        </Row>

        <Row className="filterRow">
          <Col className="align-self-center">
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text id="inputGroup-sizing-sm">
                  <FaSearch />
                </InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                aria-label="Small"
                aria-describedby="inputGroup-sizing-sm"
                placeholder={filterPlaceholder}
                onChange={this.handleFilterTextChange}
                value={filterText}
              />
              {filterText.length > 0 ? (
                <InputGroup.Append>
                  <Button
                    variant="outline-secondary"
                    onClick={this.clearFilterText}
                  >
                    <FaTimes />
                  </Button>
                </InputGroup.Append>
              ) : null}
            </InputGroup>
          </Col>
          <Col className="align-self-center">
            {filters &&
              filters.map((filter, index) => {
                return (
                  <Form.Check
                    custom
                    inline
                    key={`filter-${index}`}
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
          <Col className="text-right align-self-center">
            <Paginator
              curPage={pageNo}
              maxPage={maxPage}
              pageChange={onPageChange}
              pageChangePrev={onPrevPage}
              pageChangeNext={onNextPage}
            />
          </Col>
        </Row>

        <Table striped responsive bordered hover size="sm">
          <thead className="text-center thread-pea">
            <tr>
              {columns &&
                columns.map((col, index) => {
                  return (
                    <th key={`th-${index}`} className="align-middle">
                      {col.text}
                    </th>
                  );
                })}
              <th key={`th-toolsbar`} className="align-middle">
                <FaSlidersH />
              </th>
            </tr>
          </thead>
          <tbody>
            {data && data.length > 0 ? (
              data.map((item, index) => {
                // console.log("peaId", item.peaId);
                return (
                  <tr key={`tr-${index}`}>
                    {columns &&
                      columns.map((col, index) => {
                        return (
                          <td
                            key={`td-${index}`}
                            className={`align-middle ${
                              col.valign === "true" ? "text-center" : null
                            }`}
                          >
                            {col.canSearch ? (
                              <Highlight
                                matchStyle={{
                                  color: "white",
                                  backgroundColor: "#563d7c"
                                }}
                                search={filterText}
                              >
                                {item[col.dataField]}
                              </Highlight>
                            ) : (
                              item[col.dataField]
                            )}
                          </td>
                        );
                      })}
                    <td
                      key={`td-toolsbar`}
                      className="align-middle text-center td-tools-button"
                    >
                      <ButtonToolbar aria-label="Toolbar with button groups">
                        <OverlayTrigger
                          key={"verify"}
                          placement={"top"}
                          overlay={
                            <Tooltip id={`tooltip-verify`}>
                              ยืนยันสิทธิ์
                            </Tooltip>
                          }
                        >
                          <Button
                            key={`verify-button-${index}`}
                            variant={"outline-success"}
                            size={"sm"}
                            onClick={() => onVerify(item.peaId)}
                          >
                            <FaCheck />
                          </Button>
                        </OverlayTrigger>

                        <OverlayTrigger
                          key={"edit"}
                          placement={"top"}
                          overlay={
                            <Tooltip id={`tooltip-edit`}>แก้ไขข้อมูล</Tooltip>
                          }
                        >
                          <Button
                            key={`edit-button-${index}`}
                            size={"sm"}
                            variant={"outline-info"}
                            onClick={() => onEdit(item.peaId)}
                          >
                            <FaEdit />
                          </Button>
                        </OverlayTrigger>

                        <OverlayTrigger
                          key="delete"
                          placement="top"
                          overlay={<Tooltip id={`tooltip-delete`}>ลบ</Tooltip>}
                        >
                          <Button
                            key={`delete-button-${index}`}
                            variant="outline-danger"
                            size="sm"
                            onClick={() => onDelete(item.peaId)}
                          >
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
                  className="text-center align-middle"
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

export default DataTable;
