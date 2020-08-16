import React, { useState } from 'react';
import { connect } from 'react-redux';
import propTypes from 'proptypes';
import { useLocation } from 'react-router-dom';
import { getDataRequest } from '@reducers/data';
import { getComparisonDataRequest } from '@reducers/comparisonData';
import Button from '@components/common/Button';

const Submit = ({
  getData,
  getComparisonData,
  filters,
  comparisonFilters,
}) => {
  const { pathname } = useLocation();
  const [dataErrors, setDataErrors] = useState({
    missingStartDate: false, 
    missingEndDate: false, 
    missingCouncils: false,
    missingRequestTypes: false
  });
  const [comparisonErrors, setComparisonErrors] = useState({
    missingStartDate: false,
    missingEndDate: false, 
    missingChart: false,
    missingDistrictOne: false,
    missingDistrictTwo: false,
    missingRequestTypes: false
  })

  const validateDataForm = () => {
    const {
      startDate,
      endDate,
      councils,
      requestTypes,
    } = filters;

    const noStartDate = (startDate) ? false : true;
    const noEndDate = (endDate) ? false : true;
    const noCouncils = councils.length <= 0;
    const noRequestTypes = !(Object.values(requestTypes).includes(true));

    console.log(`noStartDate is ${noStartDate}, noEndDate is ${noEndDate}, 
    noCouncils is ${noCouncils}, noRequestTypes is ${noRequestTypes}`);
    
    if(!noStartDate && !noEndDate && !noCouncils && !noRequestTypes){
      return true;
    }

    setDataErrors({
      missingStartDate: noStartDate,
      missingEndDate: noEndDate,
      missingCouncils: noCouncils,
      missingRequestTypes: noRequestTypes,
    });
    return false;
  }

  const validateComparisonForm = () => {
    const {
      startDate,
      endDate,
      comparison: {
        chart,
        set1,
        set2,
      },
      requestTypes,
    } = comparisonFilters;

    const noStartDate = (startDate) ? false : true;
    const noEndDate = (endDate) ? false : true;
    const noChart = (chart) ? false : true;
    const noDistrictOneSet = set1.district || set1.list.length === 0;
    const noDistrictTwoSet = set2.district || set2.list.length === 0;
    const noRequestTypes = !(Object.values(requestTypes).includes(true));
    
    if(!noStartDate && !noEndDate && !noChart && !noDistrictOneSet && !noDistrictTwoSet && !noRequestTypes) {
      return true;
    }
    setComparisonErrors({
      missingStartDate: noStartDate,
      missingEndDate: noEndDate,
      missingChart: noChart,
      missingDistrictOne: noDistrictOneSet,
      missingDistrictTwo: noDistrictTwoSet,
      missingRequestTypes: noRequestTypes
    })
    return false;
  }

  const handleSubmit = () => {
    switch (pathname) {
      case '/data': {
        if (validateDataForm()) {
          console.log('Validate data form came back true');
          return getData();
        }
        break;
      }
      case '/comparison': {
        if(validateComparisonForm()){
          console.log('Validate comparison form came back true');
          return getComparisonData();
        }
        break;
      }
      default: return null;
    }
  };

  return (
    <div className="level" style={{ padding: '25px 192px 15px' }}>
      <div className="level-item">
        <Button
          id="sidebar-submit-button"
          label="Submit"
          handleClick={handleSubmit}
        />
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  filters: state.filters,
  comparisonFilters: state.comparisonFilters,
});

const mapDispatchToProps = dispatch => ({
  getData: () => dispatch(getDataRequest()),
  getComparisonData: () => dispatch(getComparisonDataRequest()),
});

Submit.propTypes = {
  getData: propTypes.func,
  getComparisonData: propTypes.func,
  filters: propTypes.shape({
    startDate: propTypes.string,
    endDate: propTypes.string,
    councils: propTypes.arrayOf(propTypes.string),
    requestTypes: propTypes.shape({}),
  }).isRequired,
  comparisonFilters: propTypes.shape({
    startDate: propTypes.string,
    endDate: propTypes.string,
    comparison: propTypes.shape({
      chart: propTypes.string,
      set1: propTypes.shape({
        district: propTypes.string,
        list: propTypes.arrayOf(propTypes.string),
      }),
      set2: propTypes.shape({
        district: propTypes.string,
        list: propTypes.arrayOf(propTypes.string),
      }),
    }),
    requestTypes: propTypes.shape({}),
  }).isRequired,
};

Submit.defaultProps = {
  getData: () => null,
  getComparisonData: () => null,
};

export default connect(mapStateToProps, mapDispatchToProps)(Submit);
