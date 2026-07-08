/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayAlert from '@clayui/alert';
import ClayButton from '@clayui/button';
import ClayDatePicker from '@clayui/date-picker';
import ClayForm from '@clayui/form';
import ClayModal from '@clayui/modal';
import {openToast} from 'frontend-js-components-web';
import {dateUtils} from 'frontend-js-web';
import React, {useMemo, useState} from 'react';

import ErrorFeedback from '../../common/components/forms/ErrorFeedback';
import ApiHelper from '../../common/services/ApiHelper';
import {ISearchAssetObjectEntry} from '../../common/types/AssetType';
import {IBulkActionFDSData} from '../../common/types/BulkActionTask';
import {
	FDS_EVENT_UPDATE_DISPLAY,
	OBJECT_ENTRY_FOLDER_CLASS_NAME,
} from '../../common/utils/constants';
import {getReviewDateError, toObjectEntryDate} from '../../common/utils/reviewDate';
import {dateConfig} from '../../content_editor/components/ScheduleField';

interface IUpdateReviewDateModalContentProps {
	closeModal: () => void;
	dataSetId?: string;
	selectedData: IBulkActionFDSData;
}

const UpdateReviewDateModalContent: React.FC<
	IUpdateReviewDateModalContentProps
> = ({closeModal, dataSetId, selectedData}) => {
	const [date, setDate] = useState<string>('');
	const [error, setError] = useState<string>('');
	const [saving, setSaving] = useState<boolean>(false);

	const items = useMemo(
		() =>
			(selectedData.items ?? []).filter(
				(item: ISearchAssetObjectEntry) =>
					item?.entryClassName !== OBJECT_ENTRY_FOLDER_CLASS_NAME &&
					Boolean(item?.actions?.update?.href)
			),
		[selectedData.items]
	);

	const locale = Liferay.ThemeDisplay.getBCP47LanguageId();

	const placeholder = dateConfig.momentFormat
		.replace(/hh:mm|HH:mm/g, '--:--')
		.replace('A', '--');

	const onSave = async () => {
		if (!date) {
			setError(Liferay.Language.get('this-field-is-required'));

			return;
		}

		const validationError = getReviewDateError(date);

		if (validationError) {
			setError(validationError);

			return;
		}

		setSaving(true);

		const reviewDate = toObjectEntryDate(date);

		const results = await Promise.all(
			items.map((item) =>
				ApiHelper.patch(
					{reviewDate},
					item.actions.update.href as string
				)
			)
		);

		setSaving(false);

		const failedCount = results.filter((result) => result.error).length;

		if (failedCount === items.length) {
			openToast({
				message: Liferay.Language.get('an-unexpected-error-occurred'),
				type: 'danger',
			});

			return;
		}

		openToast({
			message: Liferay.Language.get(
				'your-request-completed-successfully'
			),
			type: failedCount ? 'warning' : 'success',
		});

		if (dataSetId) {
			Liferay.fire(FDS_EVENT_UPDATE_DISPLAY, {id: dataSetId});
		}

		closeModal();
	};

	return (
		<>
			<ClayModal.Header
				closeButtonAriaLabel={Liferay.Language.get('close')}
			>
				Update Review Date
			</ClayModal.Header>

			<ClayModal.Body>
				<p className="text-secondary">
					{`The review date will be updated for ${items.length} item(s).`}
				</p>

				{selectedData.selectAll ? (
					<ClayAlert displayType="warning">
						Only the currently loaded items will be updated.
					</ClayAlert>
				) : null}

				<ClayForm.Group className={error ? 'has-error' : ''}>
					<label>{Liferay.Language.get('review-date')}</label>

					<ClayDatePicker
						dateFormat={dateConfig.clayFormat}
						disabled={saving}
						firstDayOfWeek={dateUtils.getFirstDayOfWeek(
							locale as Parameters<
								typeof dateUtils.getFirstDayOfWeek
							>[0]
						)}
						months={dateUtils.getMonthsLong(locale) as string[]}
						onChange={(nextValue: string) => {
							setError('');
							setDate(nextValue);
						}}
						placeholder={placeholder}
						time
						timezone={Liferay.ThemeDisplay.getTimeZone()}
						use12Hours={dateConfig.use12Hours}
						value={date}
						weekdaysShort={[...dateUtils.getWeekdaysShort(locale)]}
						years={{
							end: new Date().getFullYear() + 5,
							start: new Date().getFullYear(),
						}}
					/>

					{error ? (
						<ClayForm.FeedbackGroup>
							<ErrorFeedback message={error} />
						</ClayForm.FeedbackGroup>
					) : null}
				</ClayForm.Group>
			</ClayModal.Body>

			<ClayModal.Footer
				last={
					<ClayButton.Group spaced>
						<ClayButton
							displayType="secondary"
							onClick={closeModal}
						>
							{Liferay.Language.get('cancel')}
						</ClayButton>

						<ClayButton
							disabled={saving || !items.length}
							onClick={onSave}
						>
							{Liferay.Language.get('update')}
						</ClayButton>
					</ClayButton.Group>
				}
			/>
		</>
	);
};

export default UpdateReviewDateModalContent;
