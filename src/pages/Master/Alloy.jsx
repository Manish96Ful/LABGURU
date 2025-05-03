import React, { useEffect, useState } from 'react';
import './Alloy.css';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';

const Alloy = () => {
    const [show, setShow] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [alloyData, setAlloyData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [formData, setFormData] = useState({
      Code: '',
      Description: ''
    });
    const [selectedAlloy, setSelectedAlloy] = useState(null);
    const [isUpdate, setIsUpdate] = useState(0);

    useEffect(() => {
      getAlloy();
    }, []);

    const handleClose = () => {
      setShow(false);
      setFormData({ Code: '', Description: '' });
      setIsUpdate(0);
      setSelectedAlloy(null);
    };
    const handleShow = () => setShow(true);

    const getAlloy = async () => {
      try {
        setLoading(true);
        const param = {
          'SSCID': 3003,
          'ActionTypeID': 2,
          'LoginUserID': 1,
          'LoginReferenceID': 1015,
          'LoginCompanyID': 1,
          'SituationID': 0
        };
        const formDataToSend = new FormData();
        formDataToSend.append('ListJson', JSON.stringify(param));
        
        const response = await axios.post(
          'https://uat.illusiondentallab.com/API_2020/api/Common/List',
          formDataToSend,
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          }
        );
        
        if (response.data && response.data.data) {
          const responseData = response.data.data;
          setColumns(responseData.ColumnsName || []);
          setAlloyData(responseData.PP_MAlloy || []);
          setCurrentPage(1);
        }
      } catch (err) {
        setError('Failed to fetch alloy data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    const handleChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    };

    const handleEdit = (row) => {
      updateAlloy(row);
    };

    const updateAlloy = (row) => {
      setIsUpdate(true);
      setSelectedAlloy(row);
      setFormData({
        Code: row.Code,
        Description: row.Description
      });
      setShow(true);
    };

    const handleDelete = (row) => {
      setSelectedAlloy(row);
      setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
      if (!selectedAlloy) return;
      
      try {
        setLoading(true);
        const param = {
          'AlloyID': selectedAlloy.AlloyID,
          'LanguageID': 1,
          'Code': selectedAlloy.Code,
          'Description': selectedAlloy.Description,
          'CreationDate': selectedAlloy.CreationDate,
          'ModifyByID': 1,
          'ModificationDate': selectedAlloy.ModificationDate,
          'SSCID': 3003,
          'ActionTypeID': 1,
          'IsDeleted': true,
          'LoginUserID': 1,
          'LoginReferenceID': 1015
        };
        const formDataToSend = new FormData();
        formDataToSend.append('SaveJson', JSON.stringify(param));
        
        const response = await axios.post(
          'https://uat.illusiondentallab.com/API_2020/api/Common/Save',
          formDataToSend,
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          }
        );
        
        if (response) {
          setShowDeleteModal(false);
          await handleSuccess();
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete alloy. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    const handleSuccess = async () => {
      try {
        const param = {
          'SSCID': 3003,
          'ActionTypeID': 2,
          'LoginUserID': 1,
          'LoginReferenceID': 1015,
          'LoginCompanyID': 1,
          'SituationID': 0
        };
        const formDataToSend = new FormData();
        formDataToSend.append('ListJson', JSON.stringify(param));
        
        const response = await axios.post(
          'https://uat.illusiondentallab.com/API_2020/api/Common/List',
          formDataToSend,
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          }
        );
        
        if (response.data && response.data.data) {
          const responseData = response.data.data;
          setColumns(responseData.ColumnsName || []);
          setAlloyData(responseData.PP_MAlloy || []);
          setCurrentPage(1);
          setFormData({ Code: '', Description: '' });
          setIsUpdate(0);
          setSelectedAlloy(null);
          setShow(false);
        }
      } catch (error) {
        console.error('Error in handleSuccess:', error);
      }
    };

    const handleUpdate = async () => {
      if (!selectedAlloy) return;
      
      setLoading(true);
      setError('');
      try {
        const param = {
          'AlloyID': selectedAlloy.AlloyID,
          'LanguageID': 1,
          'Code': formData.Code.trim(),
          'Description': formData.Description.trim(),
          'CreationDate': selectedAlloy.CreationDate,
          'ModifyByID': 1,
          'ModificationDate': selectedAlloy.ModificationDate,
          'SSCID': 3003,
          'ActionTypeID': 1,
          'LoginUserID': 1,
          'isUpdate': 1
        };
        const formDataToSend = new FormData();
        formDataToSend.append('SaveJson', JSON.stringify(param));
        const response = await axios.post(
          'https://uat.illusiondentallab.com/API_2020/api/Common/Save',
          formDataToSend,
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          }
        );
        if (response) {
          await handleSuccess();
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to update alloy data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    const handleSubmit = async () => {
      if (isUpdate) {
        handleUpdate();
        return;
      }

      setLoading(true);
      setError('');
      try {
        const param = {
          'SSCID': 3003,  
          'Code': formData.Code.trim(),
          'Description': formData.Description.trim(),
          'AlloyID': 0,
          'SituationID': 0,
          'ActionTypeID': 1,
          'LoginUserID': 1
        };
        const formDataToSend = new FormData();
        formDataToSend.append('SaveJson', JSON.stringify(param));
        const response = await axios.post(
          'https://uat.illusiondentallab.com/API_2020/api/Common/Save',
          formDataToSend,
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          }
        );
        if (response) {
          await handleSuccess();
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to save alloy data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    // Add pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = alloyData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(alloyData.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
      setCurrentPage(pageNumber);
    };

    const renderPagination = () => {
      const pageNumbers = [];
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }

      return (
        <nav aria-label="Page navigation" style={{ marginTop: '20px' }}>
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
            </li>
            {pageNumbers.map(number => (
              <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => handlePageChange(number)}
                >
                  {number}
                </button>
              </li>
            ))}
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      );
    };

    return (
      <div className="">
        <div className="row header-container bgwhites-p10">
          <div className="page-title1 col-md-1">
            <h3 className="">Alloy</h3>
          </div>
          <div className="col-md-9 text-start align-self-center">
            <a className="add-button page-title" onClick={handleShow}>
              Add New Alloy
            </a>
          </div>
          
          <div className="table-section">
            {loading ? (
              <div>Loading...</div>
            ) : error ? (
              <div className="error-message">{error}</div>
            ) : (
              <>
                <div style={{ height: '450px', overflowY: 'auto', marginTop: '20px' }}>
                  <table className="table table-striped table-bordered">
                    <thead style={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 1 }}>
                      <tr>
                        <th>Actions</th>
                        {columns.map((column) => (
                          <th 
                            key={column.ColumnName}
                            className={column.CSSClass}
                          >
                            {column.ColumnHeader}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems && currentItems.length > 0 ? (
                        currentItems.map((row, index) => (
                          <tr key={index}>
                            <td>
                              <div className="d-flex gap-2">
                                <FaEdit 
                                  className="text-primary cursor-pointer" 
                                  style={{ cursor: 'pointer' }}
                                  onClick={() => handleEdit(row)}
                                />
                                <FaTrash 
                                  className="text-danger cursor-pointer" 
                                  style={{ cursor: 'pointer' }}
                                  onClick={() => handleDelete(row)}
                                />
                              </div>
                            </td>
                            <td>{row.Code}</td>
                            <td>{row.Description}</td>
                            <td>{row.CreatedBy}</td>
                            <td>{row.CreationDate}</td>
                            <td>{row.ModifyBy}</td>
                            <td>{row.ModificationDate}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={columns.length} className="text-center">
                            No data available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                {renderPagination()}
              </>
            )}
          </div>

          <Modal show={show} onHide={handleClose} aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header closeButton>
              <Modal.Title>{isUpdate ? 'Update Alloy' : 'Add Alloy'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form className="login-form row">
                <div className='col-md-12 d-flex justify-content-between'>
                  <div className="form-group col-md-6">
                    <label htmlFor="Code">
                      Code <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="Code"
                      name="Code"
                      value={formData.Code}
                      onChange={handleChange}
                      placeholder="Enter Code"
                      required
                    />
                  </div>
                  <div className="form-group col-md-6 Description">
                    <label htmlFor="Description">
                      Description <span className="required">*</span>
                    </label>
                    <div className="password-input">
                      <input
                        type="text"
                        id="Description"
                        name="Description"
                        value={formData.Description}
                        onChange={handleChange}
                        placeholder="Enter Description"
                        required
                      />
                    </div>
                  </div>
                </div>
              </form>
            </Modal.Body>
            <Modal.Footer>
              <Button className="secondary-button" onClick={handleClose}>
                Close
              </Button>
              <Button className="Save-button" onClick={handleSubmit}>
                {isUpdate ? 'Update' : 'Save'}
              </Button>
            </Modal.Footer>
          </Modal>

          <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>Delete Alloy</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Are you sure you want to delete this alloy?
            </Modal.Body>
            <Modal.Footer>
              <Button className="secondary-button" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </Button>
              <Button className="btn-danger" onClick={handleDeleteConfirm}>
                Delete
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    );
};

export default Alloy; 