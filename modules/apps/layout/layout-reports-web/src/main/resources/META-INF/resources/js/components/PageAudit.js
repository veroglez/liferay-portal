/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */

import ClayTabs from '@clayui/tabs';
import {fetch} from 'frontend-js-web';
import React, {useContext, useEffect, useState} from 'react';

import {ConstantsContext} from '../context/ConstantsContext';
import LayoutReports from './layout_reports/LayoutReports';

import './PageAudit.scss';

export default function PageAudit({layoutReportsEventTriggered, panelIsOpen}) {
	const [activeTab, setActiveTab] = useState(0);
	const [tabs, setTabs] = useState([]);
	const {layoutReportsTabsURL} = useContext(ConstantsContext);

	useEffect(() => {
		if (panelIsOpen) {
			fetch(layoutReportsTabsURL, {method: 'GET'})
				.then((response) => response.json())
				.then((tabs) => setTabs(tabs))
				.catch((error) => console.error(error));
		}
	}, [layoutReportsTabsURL, panelIsOpen]);

	return tabs.length ? (
		<>
			<ClayTabs
				active={activeTab}
				className="px-2"
				onActiveChange={setActiveTab}
			>
				{tabs.map((tab, index) => (
					<ClayTabs.Item
						id={`tab-${tab.id}`}
						innerProps={{
							'aria-controls': `tabpanel-${index}`,
						}}
						key={tab.id}
					>
						{Liferay.Language.get(tab.name)}
					</ClayTabs.Item>
				))}
			</ClayTabs>
			<ClayTabs.Content activeIndex={activeTab} fade>
				<ClayTabs.TabPane
					aria-labelledby="tab-render-times"
					className="p-3"
				></ClayTabs.TabPane>

				<ClayTabs.TabPane
					aria-labelledby="tab-page-speed-insights"
					className="p-3"
				>
					<LayoutReports
						eventTriggered={layoutReportsEventTriggered}
						url={tabs[1].url}
					/>
				</ClayTabs.TabPane>
			</ClayTabs.Content>{' '}
		</>
	) : null;
}
