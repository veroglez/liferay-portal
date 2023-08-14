/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayButton from '@clayui/button';
import ClayLabel from '@clayui/label';
import classNames from 'classnames';
import {sub} from 'frontend-js-web';
import React from 'react';

import {Fragment, FragmentsFilter} from '../../constants/fragments';

interface PropsResultsBar {
	className: string;
	filter: FragmentsFilter;
	fragments: Fragment[];
	onSetFilter: Function;
}

const ResultsBarItem = ({
	children,
	expand,
}: {
	children: React.ReactElement;
	expand?: boolean;
}) => {
	return (
		<div className={classNames('tbar-item', {'tbar-item-expand': expand})}>
			{children}
		</div>
	);
};

export default function ResultsBar({
	className,
	filter,
	fragments,
	onSetFilter,
}: PropsResultsBar) {
	if (!Object.keys(filter).length) {
		return null;
	}

	return (
		<div
			className={classNames('subnav-tbar subnav-tbar-primary', className)}
		>
			<div className="tbar-nav tbar-nav-wrap">
				<ResultsBarItem>
					<span className="component-text">
						{sub(
							Liferay.Language.get('x-results-for'),
							fragments.length
						)}
					</span>
				</ResultsBarItem>

				{Object.keys(filter).length
					? Object.entries(filter).map(([key, {label}]) => (
							<ResultsBarItem key={key}>
								<ClayLabel
									className="component-label tbar-label"
									closeButtonProps={{
										['aria-label']: sub(
											Liferay.Language.get(
												'remove-x-filter'
											),
											label
										),
										onClick: () => {
											const {
												[key as keyof typeof filter]: _,
												...rest
											} = filter;

											onSetFilter(rest);
										},
									}}
									displayType="unstyled"
									withClose
								>
									{label}
								</ClayLabel>
							</ResultsBarItem>
					  ))
					: null}

				<ResultsBarItem expand>
					<ClayButton
						aria-label={Liferay.Language.get('clear-filters')}
						className="ml-auto"
						displayType={null}
						onClick={() => onSetFilter({})}
					>
						{Liferay.Language.get('clear')}
					</ClayButton>
				</ResultsBarItem>
			</div>
		</div>
	);
}
