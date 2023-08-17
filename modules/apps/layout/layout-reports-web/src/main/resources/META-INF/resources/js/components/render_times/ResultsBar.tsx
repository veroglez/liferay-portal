/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayButton from '@clayui/button';
import ClayLabel from '@clayui/label';
import classNames from 'classnames';
import {sub} from 'frontend-js-web';
import React, {useEffect, useState} from 'react';

import {Fragment, FragmentFilter, filterNames} from '../../constants/fragments';

interface PropsResultsBar {
	className: string;
	filters: FragmentFilter;
	fragments: Fragment[];
	onSetFilters: Function;
}

interface PropsResultsBarItemLabel {
	filterKey: string;
	label: string;
	onSetFeedback: Function;
	onSetFilters: Function;
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

const ResultsBarItemLabel = ({
	filterKey,
	label,
	onSetFeedback,
	onSetFilters,
}: PropsResultsBarItemLabel) => {
	return (
		<ResultsBarItem>
			<ClayLabel
				className="component-label tbar-label"
				closeButtonProps={{
					['aria-label']: sub(
						Liferay.Language.get('remove-x-filter'),
						label
					),
					onClick: () => {
						onSetFilters(
							({
								[filterKey as keyof FragmentFilter]: _,
								...rest
							}) => rest
						);
						onSetFeedback(Liferay.Language.get('filter-removed'));
					},
				}}
				displayType="unstyled"
				withClose
			>
				{label}
			</ClayLabel>
		</ResultsBarItem>
	);
};

export default function ResultsBar({
	className,
	filters,
	fragments,
	onSetFilters,
}: PropsResultsBar) {
	const [feedback, setFeedback] = useState('');

	useEffect(() => {
		if (feedback) {
			const timeout = setTimeout(() => setFeedback(''), 1000);

			return () => clearTimeout(timeout);
		}
	}, [feedback]);

	return (
		<>
			<span className="sr-only" role="alert">
				{feedback}
			</span>

			{Object.values(filters)?.length ? (
				<div
					className={classNames(
						'subnav-tbar subnav-tbar-primary',
						className
					)}
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

						{Object.entries(filters).map(([key, value]) => (
							<ResultsBarItemLabel
								filterKey={key}
								key={value}
								label={filterNames[value]}
								onSetFeedback={setFeedback}
								onSetFilters={onSetFilters}
							/>
						))}

						<ResultsBarItem expand>
							<ClayButton
								aria-label={Liferay.Language.get(
									'clear-filters'
								)}
								className="ml-auto"
								displayType={null}
								onClick={() => {
									onSetFilters({});
									setFeedback(
										Liferay.Language.get('filters-cleared')
									);
								}}
							>
								{Liferay.Language.get('clear')}
							</ClayButton>
						</ResultsBarItem>
					</div>
				</div>
			) : null}
		</>
	);
}
