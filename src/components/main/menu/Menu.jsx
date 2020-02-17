/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import { slide as Sidebar } from 'react-burger-menu';
import { connect } from 'react-redux';
import propTypes from 'proptypes';

import Button from '../../common/Button';
import NCSelector from './NCSelector';
import DateSelector from './DateSelector/DateSelector';

import { getDataRequest } from '../../../redux/reducers/data';

const Menu = ({
  data,
  getData,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('Map');
  const sidebarWidth = '509px';

  const tabs = [
    'Map',
    'Data Visualization',
  ];

  const handleActiveTab = (tab) => (tab === activeTab ? 'is-active' : '');
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleSubmitButton = () => {
    getData();
  };

  return (
    <div>
      <Sidebar
        noOverlay
        disableAutoFocus
        pageWrapId="sidebar-wrapper"
        outerContainerId="body-container"
        isOpen={isOpen}
        width={sidebarWidth}
        customBurgerIcon={false}
        customCrossIcon={false}
        styles={{
          bmMenu: {
            background: 'white',
            boxShadow: '0px 4px 5px rgba(108, 108, 108, 0.3)',
          },
        }}
      >
        <div
          id="sidebar-wrapper"
          className="sidebar-content"
        >

          {/* Tabs */}
          <div
            className="tabs is-fullwidth is-toggle"
            style={{
              height: '40px',
              margin: '0',
            }}
          >
            <ul>
              {tabs.map((tab) => (
                <li
                  key={tab}
                  className={handleActiveTab(tab)}
                  style={{ width: '254px' }}
                >
                  <a onClick={() => { handleTabClick(tab); }}>
                    {tab}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Open/Close Button */}
          <Button
            id="menu-toggle-button"
            icon={!isOpen ? 'chevron-right' : 'chevron-left'}
            iconStyle={{ margin: '0px' }}
            style={{
              position: 'fixed',
              left: sidebarWidth,
              height: '60px',
              width: '26px',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
              borderRadius: '0',
            }}
            handleClick={() => setIsOpen(!isOpen)}
            color="light"
          />

          {/* Content */}
          <div className="sidebar-content" style={{ padding: '16px' }}>
            <div className="sidebar-title">
              <p className="subtitle">
                <strong>
                  Filters
                </strong>
              </p>
            </div>
            <DateSelector />
            <NCSelector />
            <div className="container" style={{ padding: '10px', textAlign: 'center' }}>
              <Button
                id="submit"
                label="Submit"
                handleClick={handleSubmitButton}
                loading={data.isLoading}
              />
            </div>
          </div>
        </div>
      </Sidebar>
    </div>
  );
};

const mapStateToProps = (state) => ({
  data: state.data,
});

const mapDispatchToProps = (dispatch) => ({
  getData: () => dispatch(getDataRequest()),
});

Menu.propTypes = {
  getData: propTypes.func,
  data: propTypes.shape({
    isLoading: propTypes.bool,
  }),
};

Menu.defaultProps = {
  getData: () => null,
  data: undefined,
};

export default connect(mapStateToProps, mapDispatchToProps)(Menu);
