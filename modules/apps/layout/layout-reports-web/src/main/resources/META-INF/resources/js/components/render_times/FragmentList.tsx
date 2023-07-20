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

import {ClayButtonWithIcon} from '@clayui/button';
import ClayLabel from '@clayui/label';
import {sub} from 'frontend-js-web';
import React from 'react';

import {Fragment} from '../../constants/fragments';

export default function FragmentList({
	ascendingSort,
	fragments,
}: {
	ascendingSort: boolean;
	fragments: Fragment[];
}) {
	return (
		<div className="page-audit__fragmentList">
			{fragments
				.sort((a: Fragment, b: Fragment) =>
					ascendingSort
						? a.renderTime - b.renderTime
						: b.renderTime - a.renderTime
				)
				.map(
					({
						cached,
						fragment,
						fragmentCollectionURL,
						fromMaster,
						itemId,
						name,
						renderTime,
					}) => {
						return (
							<div
								className="c-p-1 d-flex flex-column page-audit__fragment"
								key={itemId}
							>
								<span className="font-weight-bold position-relative">
									{name}

									<span className="page-audit__fragment__buttons">
										<ClayButtonWithIcon
											aria-label={sub(
												Liferay.Language.get(
													'locate-x-in-page'
												),
												name
											)}
											displayType="unstyled"
											size="sm"
											symbol="search"
											title={sub(
												Liferay.Language.get(
													'locate-x-in-page'
												),
												name
											)}
										/>

										{fragmentCollectionURL ? (
											<ClayButtonWithIcon
												aria-label={sub(
													Liferay.Language.get(
														'open-x-in-fragment-library'
													),
													name
												)}
												className="c-ml-2"
												displayType="unstyled"
												onClick={() =>
													window.open(
														fragmentCollectionURL,
														'_blank'
													)
												}
												size="sm"
												symbol="shortcut"
												title={sub(
													Liferay.Language.get(
														'open-x-in-fragment-library'
													),
													name
												)}
											/>
										) : null}
									</span>
								</span>

								<span>{renderTime}ms</span>

								<span>
									<ClayLabel displayType="secondary">
										{fragment
											? Liferay.Language.get('fragment')
											: Liferay.Language.get('widget')}
									</ClayLabel>

									{fromMaster && (
										<ClayLabel displayType="secondary">
											{Liferay.Language.get(
												'from-master'
											)}
										</ClayLabel>
									)}

									{cached && (
										<ClayLabel displayType="info">
											{Liferay.Language.get('cached')}
										</ClayLabel>
									)}
								</span>
							</div>
						);
					}
				)}
		</div>
	);
}
