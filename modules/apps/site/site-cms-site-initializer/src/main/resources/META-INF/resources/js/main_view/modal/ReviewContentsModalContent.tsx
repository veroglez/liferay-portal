/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayModal from '@clayui/modal';
import {FrontendDataSet, IInternalRenderer} from '@liferay/frontend-data-set-web';
import React from 'react';

import ReviewDateInputRenderer from '../props_transformer/cell_renderers/ReviewDateInputRenderer';

import '../../../css/components/ReviewContentsModal.scss';

interface IReviewContentsModalContentProps {
	apiURL: string;
}

const ReviewContentsModalContent: React.FC<IReviewContentsModalContentProps> = ({
	apiURL,
}) => (
	<>
		<ClayModal.Header closeButtonAriaLabel={Liferay.Language.get('close')}>
			Review Dates
		</ClayModal.Header>

		<ClayModal.Body>

			{/* The FDS renders a table view, so its column header is hidden via
			    ReviewContentsModal.scss to get the header-less list look while
			    keeping the inline review date input (a table cell renderer). No
			    bulk actions or selectionType are passed, so rows are not
			    selectable. */}

			<div className="cms-review-contents-modal">
				<FrontendDataSet
					apiURL={apiURL}
					customRenderers={{
						tableCell: [
							{
								component: ReviewDateInputRenderer,
								name: 'reviewDateTableCellRenderer',
								type: 'internal',
							} as IInternalRenderer,
						],
					}}
					id="cmsReviewContents"
					pagination={{
						deltas: [{label: 20}, {label: 40}, {label: 60}],
						initialDelta: 20,
					}}
					showManagementBar
					showPagination
					showSearch
					sorts={[
						{
							active: true,
							direction: 'asc',
							key: 'dateReview',
							label: Liferay.Language.get('review-date'),
						},
					]}
					views={[
						{
							contentRenderer: 'table',
							default: true,
							label: Liferay.Language.get('table'),
							name: 'table',
							schema: {
								fields: [
									{
										fieldName: 'embedded.title',
										label: Liferay.Language.get('title'),
									},
									{
										contentRenderer:
											'reviewDateTableCellRenderer',
										fieldName: 'dateReview',
										label: Liferay.Language.get(
											'review-date'
										),
									},
								],
							},
							thumbnail: 'table',
						},
					]}
				/>
			</div>
		</ClayModal.Body>
	</>
);

export default ReviewContentsModalContent;
