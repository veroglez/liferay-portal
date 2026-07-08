/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayDatePicker from '@clayui/date-picker';
import ClayForm from '@clayui/form';
import {openToast} from 'frontend-js-components-web';
import {dateUtils} from 'frontend-js-web';
import React, {useId, useRef, useState} from 'react';

import ErrorFeedback from '../../../common/components/forms/ErrorFeedback';
import ApiHelper from '../../../common/services/ApiHelper';
import {
	getReviewDateError,
	toObjectEntryDate,
} from '../../../common/utils/reviewDate';
import {isReviewDateOverdue} from '../../../common/utils/reviewDateStatus';
import {
	dateConfig,
	toMomentDate,
} from '../../../content_editor/components/ScheduleField';

interface IItemData {
	actions?: {
		update?: {
			href: string;
		};
	};
	dateReview?: string;
}

const ReviewDateInputRenderer = ({
	itemData,
	loadData,
	value,
}: {
	itemData?: IItemData;
	loadData?: () => void;
	value?: string;
}) => {
	const rawValue = value || itemData?.dateReview;

	const [date, setDate] = useState<string>(
		rawValue ? toMomentDate(rawValue) : ''
	);
	const [error, setError] = useState<string>('');
	const [saving, setSaving] = useState<boolean>(false);

	const committedRef = useRef<string>(date);
	const errorId = useId();

	const updateAction = itemData?.actions?.update;

	// Read-only fallback: when the user has no update permission the FDS item
	// does not expose an update action, so keep the original display.

	if (!updateAction?.href) {
		if (!rawValue) {
			return <span className="text-secondary">--</span>;
		}

		return (
			<span
				className={
					isReviewDateOverdue(new Date(rawValue))
						? 'text-warning'
						: 'text-dark'
				}
			>
				{toMomentDate(rawValue)}
			</span>
		);
	}

	const locale = Liferay.ThemeDisplay.getBCP47LanguageId();

	const commit = async (momentValue: string) => {
		if (momentValue === committedRef.current) {
			return;
		}

		const validationError = getReviewDateError(momentValue);

		if (validationError) {
			setError(validationError);

			return;
		}

		setError('');

		committedRef.current = momentValue;

		setSaving(true);

		// Send only the review date. The Object entry PATCH merges partial
		// updates, so the other fields are left untouched. Persisting
		// reviewDate requires the "LPD-17564" feature flag.

		const {error: requestError} = await ApiHelper.patch(
			{
				reviewDate: momentValue ? toObjectEntryDate(momentValue) : null,
			},
			updateAction.href
		);

		if (requestError) {
			committedRef.current = rawValue ? toMomentDate(rawValue) : '';

			setDate(committedRef.current);

			openToast({message: requestError, type: 'danger'});
		}
		else {
			openToast({
				message: Liferay.Language.get(
					'your-request-completed-successfully'
				),
				type: 'success',
			});

			loadData?.();
		}

		setSaving(false);
	};

	const placeholder = dateConfig.momentFormat
		.replace(/hh:mm|HH:mm/g, '--:--')
		.replace('A', '--');

	return (

		// Stop the click from bubbling to the FDS table row, whose onClick
		// selects the item.

		<div onClick={(event) => event.stopPropagation()}>
			<ClayForm.Group className={error ? 'has-error mb-0' : 'mb-0'}>
				<ClayDatePicker
					aria-describedby={error ? errorId : undefined}
					dateFormat={dateConfig.clayFormat}
					disabled={saving}
					firstDayOfWeek={dateUtils.getFirstDayOfWeek(
						locale as Parameters<
							typeof dateUtils.getFirstDayOfWeek
						>[0]
					)}
					months={dateUtils.getMonthsLong(locale) as string[]}
					onBlur={({target: {value}}) => commit(value)}
					onChange={(nextValue: string) => {
						setError('');
						setDate(nextValue);
					}}
					onExpandedChange={(open: boolean) => {
						if (!open) {
							commit(date);
						}
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
					<ClayForm.FeedbackGroup id={errorId}>
						<ErrorFeedback message={error} />
					</ClayForm.FeedbackGroup>
				) : null}
			</ClayForm.Group>
		</div>
	);
};

export default ReviewDateInputRenderer;
