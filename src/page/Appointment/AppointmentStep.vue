<template>
  <section _ngcontent-serverapp-c115="" class="bg-gray-100 py-5 text-gray-800">
    <div _ngcontent-serverapp-c115="" class="max-w-7xl mx-auto md:px-2">
      <div
        _ngcontent-serverapp-c115=""
        class="hidden md:block"
        _nghost-serverapp-c98=""
      >
        <div
          _ngcontent-serverapp-c98=""
          mousescrollhorizontal=""
          class="px-10 py-6 flex flex-row gap-4 hide-scroll-bar overflow-auto ng-star-inserted"
        >
          <div
            _ngcontent-serverapp-c98=""
            class="cursor-pointer flex-shrink-0 flex flex-row items-center gap-2 ng-star-inserted"
          >
            <img
              _ngcontent-serverapp-c98=""
              :src="checkedBgBlueIcon"
              alt=""
              class="w-6 h-6 ng-star-inserted"
            />
            <div
              _ngcontent-serverapp-c98=""
              class="font-normal text-sm text-gray-800 leading-17"
            >
              Thời gian khám
            </div>
            <img
              _ngcontent-serverapp-c98=""
              :src="borderIcon"
              class="w-6 h-6 ng-star-inserted"
            />
          </div>

          <div
            _ngcontent-serverapp-c98=""
            class="cursor-pointer flex-shrink-0 flex flex-row items-center gap-2 ng-star-inserted"
          >
            <div
              _ngcontent-serverapp-c98=""
              class="w-6 h-6 bg-green-500 text-white text-center rounded ng-star-inserted"
            >
              2
            </div>

            <div
              _ngcontent-serverapp-c98=""
              class="font-normal text-sm text-gray-800 leading-17"
            >
              Bệnh nhân
            </div>
          </div>
        </div>
      </div>
      <div _ngcontent-serverapp-c115="" class="grid grid-cols-12 gap-4">
        <div
          _ngcontent-serverapp-c115=""
          class="col-span-12 md:col-span-7 lg:col-span-8 space-y-4 bg-white"
        >
          <div
            _ngcontent-serverapp-c115=""
            nzsize="small"
            nzdirection="vertical"
            class="ant-steps ant-steps-vertical ant-steps-small"
          >
            <div
              _ngcontent-serverapp-c115=""
              class="ant-steps-item ant-steps-item-wait ant-steps-item-active ng-star-inserted"
            >
              <div class="ant-steps-item-container" tabindex="0" role="button">
                <div class="ant-steps-item-content">
                  <div class="ant-steps-item-description">
                    <div
                      _ngcontent-serverapp-c115=""
                      class="p-4 ng-star-inserted"
                    >
                      <div
                        _ngcontent-serverapp-c103=""
                        class="font-semibold text-base text-gray-800"
                      >
                        Hồ sơ bệnh nhân
                      </div>
                      <div
                        _ngcontent-serverapp-c115=""
                        _nghost-serverapp-c114=""
                      >
                        <div _ngcontent-serverapp-c114="" class="text-gray-800">
                          <div
                            _ngcontent-serverapp-c114=""
                            _nghost-serverapp-c108=""
                          >
                            <div
                              _ngcontent-serverapp-c108=""
                              class="border-t border-t-gray-100 mt-3 py-4 space-y-4 ng-star-inserted"
                            >
                              <div _ngcontent-serverapp-c108="" hidden="">
                                <form
                                  _ngcontent-serverapp-c108=""
                                  novalidate=""
                                  action="."
                                  class="relative ng-untouched ng-pristine ng-valid"
                                >
                                  <img
                                    _ngcontent-serverapp-c108=""
                                    width="18"
                                    height="18"
                                    src="./assets/img/booking/svg/search-normal.svg"
                                    class="cursor-pointer absolute left-3 bottom-1/2 translate-y-1/2 object-cover"
                                  /><input
                                    _ngcontent-serverapp-c108=""
                                    type="search"
                                    formcontrolname="query"
                                    placeholder="Tìm nhanh"
                                    class="mt-1 pl-8 pr-3 py-2 focus:ring-primary focus:border-primary block w-full shadow-sm placeholder:text-sm border border-gray-200 rounded-md ng-untouched ng-pristine ng-valid"
                                  />
                                </form>
                              </div>
                              <div
                                _ngcontent-serverapp-c108=""
                                class="ant-spin-nested-loading"
                              >
                                <div
                                  class="ant-spin-container ng-star-inserted"
                                >
                                  <div
                                    _ngcontent-serverapp-c108=""
                                    id="patient"
                                    infinite-scroll=""
                                    class="grid gap-4 max-h-96 overflow-y-auto ng-star-inserted"
                                  >
                                    <div
                                      v-for="(record, idx) in patientRecords"
                                      :key="record.patientId"
                                    >
                                      <div
                                        _ngcontent-serverapp-c107=""
                                        class="flex flex-col gap-4 p-4"
                                        v-if="idx === 0"
                                      >
                                        <ul
                                          _ngcontent-serverapp-c107=""
                                          class="divide-y divide-gray-100"
                                        >
                                          <li
                                            _ngcontent-serverapp-c107=""
                                            class="flex justify-between flex-wrap text-gray-800 py-1 ng-star-inserted"
                                          >
                                            <p _ngcontent-serverapp-c107="">
                                              Mã bệnh nhân
                                            </p>
                                            <p
                                              _ngcontent-serverapp-c107=""
                                              class="font-medium"
                                            >
                                              {{ record.patientId }}
                                            </p>
                                          </li>

                                          <li
                                            _ngcontent-serverapp-c107=""
                                            class="flex justify-between flex-wrap text-gray-800 py-2 ng-star-inserted"
                                          >
                                            <p _ngcontent-serverapp-c107="">
                                              Họ và tên
                                            </p>
                                            <p
                                              _ngcontent-serverapp-c107=""
                                              class="font-medium"
                                            >
                                              adsadasd
                                            </p>
                                          </li>

                                          <li
                                            _ngcontent-serverapp-c107=""
                                            class="flex justify-between flex-wrap text-gray-800 py-2 ng-star-inserted"
                                          >
                                            <p _ngcontent-serverapp-c107="">
                                              Giới tính
                                            </p>
                                            <p
                                              _ngcontent-serverapp-c107=""
                                              class="font-medium"
                                            >
                                              Nam
                                            </p>
                                          </li>

                                          <li
                                            _ngcontent-serverapp-c107=""
                                            class="flex justify-between flex-wrap text-gray-800 py-2"
                                          >
                                            <p _ngcontent-serverapp-c107="">
                                              Ngày sinh
                                            </p>
                                            <p
                                              _ngcontent-serverapp-c107=""
                                              class="font-medium"
                                            >
                                              01/01/1990
                                            </p>
                                          </li>
                                          <li
                                            _ngcontent-serverapp-c107=""
                                            class="flex justify-between flex-wrap text-gray-800 py-2 ng-star-inserted"
                                          >
                                            <p _ngcontent-serverapp-c107="">
                                              Số điện thoại
                                            </p>
                                            <p
                                              _ngcontent-serverapp-c107=""
                                              class="font-medium"
                                            >
                                              0977789898
                                            </p>
                                          </li>

                                          <li
                                            _ngcontent-serverapp-c107=""
                                            class="flex justify-between flex-wrap text-gray-800 py-2 ng-star-inserted"
                                          >
                                            <p _ngcontent-serverapp-c107="">
                                              Địa chỉ
                                            </p>
                                            <p
                                              _ngcontent-serverapp-c107=""
                                              class="font-medium"
                                            >
                                              ưerwewtw
                                            </p>
                                          </li>
                                        </ul>
                                        <div
                                          _ngcontent-serverapp-c107=""
                                          class="flex flex-row gap-4 items-start"
                                        >
                                          <a
                                            _ngcontent-serverapp-c107=""
                                            class="font-semibold text-sm text-primary leading-17 bg-blue-50 border-inherit shadow-sm rounded px-4 py-3"
                                            >Điều chỉnh</a
                                          >
                                        </div>
                                      </div>
                                      <div
                                        _ngcontent-serverapp-c108=""
                                        _nghost-serverapp-c107=""
                                        id="patient0"
                                        class="ng-star-inserted"
                                      >
                                        <div
                                          _ngcontent-serverapp-c107=""
                                          class="cursor-pointer border-gray-300 rounded-lg flex flex-col ng-star-inserted active"
                                        >
                                          <div
                                            _ngcontent-serverapp-c107=""
                                            class="item flex flex-row justify-between items-center p-2"
                                          >
                                            <div
                                              _ngcontent-serverapp-c107=""
                                              class="flex row gap-1"
                                            >
                                              <div
                                                class="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50"
                                                :class="{
                                                  'bg-gray-50':
                                                    selectedRecord &&
                                                    selectedRecord.patientId ===
                                                      record.patientId,
                                                }"
                                                @click="selectRecord(record)"
                                              >
                                                <div class="relative w-12 h-12">
                                                  <img
                                                    :src="familyBlockIcon"
                                                    alt="Primary"
                                                    class="w-12 h-12"
                                                  />
                                                  <div
                                                    class="absolute inset-0 flex items-center justify-center"
                                                  >
                                                    <span
                                                      class="absolute z-10 w-8 h-8 rounded-full bg-[#22d3ee]"
                                                    ></span>
                                                    <div
                                                      class="absolute z-20 text-sm text-white font-bold"
                                                    >
                                                      AD
                                                    </div>
                                                    <span
                                                      v-if="idx === 0"
                                                      class="absolute z-20 text-xs bg-gray-400 rounded-full -top-1 right-0 text-white px-1"
                                                      >Tôi</span
                                                    >
                                                    <span
                                                      v-else
                                                      class="absolute z-20 text-xs bg-gray-400 rounded-full -top-1 right-0 text-white px-1"
                                                      >Cha</span
                                                    >
                                                  </div>
                                                </div>
                                              </div>
                                              <div
                                                _ngcontent-serverapp-c107=""
                                                class="flex flex-col justify-center items-start"
                                              >
                                                <span
                                                  _ngcontent-serverapp-c107=""
                                                  class="font-medium text-base text-gray-800"
                                                >
                                                  {{ record.patientName }} </span
                                                ><span
                                                  _ngcontent-serverapp-c107=""
                                                  class="font-normal text-sm text-gray-600"
                                                >
                                                  {{ record.dateOfBirth }}
                                                </span>
                                              </div>
                                            </div>
                                            <button
                                              _ngcontent-serverapp-c107=""
                                              class="p-2"
                                            >
                                              <img
                                                _ngcontent-serverapp-c107=""
                                                :src="arrowDownIcon"
                                                title="Xem thêm thông tin"
                                                class="cursor-pointer w-4 h-4"
                                              />
                                            </button>
                                          </div>
                                          <div
                                            _ngcontent-serverapp-c107=""
                                            class="flex flex-col gap-4 p-4 hidden"
                                          >
                                            <ul
                                              _ngcontent-serverapp-c107=""
                                              class="divide-y divide-gray-100"
                                            >
                                              <li
                                                _ngcontent-serverapp-c107=""
                                                class="flex justify-between flex-wrap text-gray-800 py-1 ng-star-inserted"
                                              >
                                                <p _ngcontent-serverapp-c107="">
                                                  Mã bệnh nhân
                                                </p>
                                                <p
                                                  _ngcontent-serverapp-c107=""
                                                  class="font-medium"
                                                >
                                                  YMP252146155
                                                </p>
                                              </li>

                                              <li
                                                _ngcontent-serverapp-c107=""
                                                class="flex justify-between flex-wrap text-gray-800 py-2 ng-star-inserted"
                                              >
                                                <p _ngcontent-serverapp-c107="">
                                                  Họ và tên
                                                </p>
                                                <p
                                                  _ngcontent-serverapp-c107=""
                                                  class="font-medium"
                                                >
                                                  Nguyễn Văn Addd
                                                </p>
                                              </li>

                                              <li
                                                _ngcontent-serverapp-c107=""
                                                class="flex justify-between flex-wrap text-gray-800 py-2 ng-star-inserted"
                                              >
                                                <p _ngcontent-serverapp-c107="">
                                                  Giới tính
                                                </p>
                                                <p
                                                  _ngcontent-serverapp-c107=""
                                                  class="font-medium"
                                                >
                                                  Nam
                                                </p>
                                              </li>

                                              <li
                                                _ngcontent-serverapp-c107=""
                                                class="flex justify-between flex-wrap text-gray-800 py-2"
                                              >
                                                <p _ngcontent-serverapp-c107="">
                                                  Ngày sinh
                                                </p>
                                                <p
                                                  _ngcontent-serverapp-c107=""
                                                  class="font-medium"
                                                >
                                                  23/02/1990
                                                </p>
                                              </li>
                                              <li
                                                _ngcontent-serverapp-c107=""
                                                class="flex justify-between flex-wrap text-gray-800 py-2 ng-star-inserted"
                                              >
                                                <p _ngcontent-serverapp-c107="">
                                                  Số điện thoại
                                                </p>
                                                <p
                                                  _ngcontent-serverapp-c107=""
                                                  class="font-medium"
                                                >
                                                  0978567567
                                                </p>
                                              </li>

                                              <li
                                                _ngcontent-serverapp-c107=""
                                                class="flex justify-between flex-wrap text-gray-800 py-2 ng-star-inserted"
                                              >
                                                <p _ngcontent-serverapp-c107="">
                                                  Địa chỉ
                                                </p>
                                                <p
                                                  _ngcontent-serverapp-c107=""
                                                  class="font-medium"
                                                >
                                                  số nhà 234523
                                                </p>
                                              </li>
                                            </ul>
                                            <div
                                              _ngcontent-serverapp-c107=""
                                              class="flex flex-row gap-4 items-start"
                                            >
                                              <a
                                                _ngcontent-serverapp-c107=""
                                                class="font-semibold text-sm text-primary leading-17 bg-blue-50 border-inherit shadow-sm rounded px-4 py-3"
                                                >Điều chỉnh</a
                                              >
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    <div
                                      _ngcontent-serverapp-c108=""
                                      _nghost-serverapp-c107=""
                                      id="patient1"
                                      class="ng-star-inserted"
                                    >
                                      <div
                                        _ngcontent-serverapp-c107=""
                                        class="cursor-pointer border-gray-300 rounded-lg flex flex-col ng-star-inserted"
                                      >
                                        <div
                                          _ngcontent-serverapp-c107=""
                                          class="item flex flex-row justify-between items-center p-2"
                                        >
                                          <div
                                            _ngcontent-serverapp-c107=""
                                            class="flex row gap-1"
                                          >
                                            <div
                                              class="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50"
                                              :class="{
                                                'bg-gray-50':
                                                  selectedRecord &&
                                                  selectedRecord.patientId ===
                                                    record.patientId,
                                              }"
                                              @click="selectRecord(record)"
                                            >
                                              <div class="relative w-12 h-12">
                                                <img
                                                  :src="familyBlockIcon"
                                                  alt="Primary"
                                                  class="w-12 h-12"
                                                />
                                                <div
                                                  class="absolute inset-0 flex items-center justify-center"
                                                >
                                                  <span
                                                    class="absolute z-10 w-8 h-8 rounded-full bg-[#22d3ee]"
                                                  ></span>
                                                  <div
                                                    class="absolute z-20 text-sm text-white font-bold"
                                                  >
                                                    AD
                                                  </div>
                                                  <span
                                                    v-if="idx === 0"
                                                    class="absolute z-20 text-xs bg-gray-400 rounded-full -top-1 right-0 text-white px-1"
                                                    >Tôi</span
                                                  >
                                                  <span
                                                    v-else
                                                    class="absolute z-20 text-xs bg-gray-400 rounded-full -top-1 right-0 text-white px-1"
                                                    >Cha</span
                                                  >
                                                </div>
                                              </div>
                                            </div>
                                            <div
                                              _ngcontent-serverapp-c107=""
                                              class="flex flex-col justify-center items-start"
                                            >
                                              <span
                                                _ngcontent-serverapp-c107=""
                                                class="font-medium text-base text-gray-800"
                                              >
                                                adsadasd </span
                                              ><span
                                                _ngcontent-serverapp-c107=""
                                                class="font-normal text-sm text-gray-600"
                                              >
                                                01/01/1990
                                              </span>
                                            </div>
                                          </div>
                                          <button
                                            _ngcontent-serverapp-c107=""
                                            class="p-2"
                                          >
                                            <img
                                              _ngcontent-serverapp-c107=""
                                              :src="arrowDownIcon"
                                              title="Xem thêm thông tin"
                                              class="cursor-pointer w-4 h-4"
                                            />
                                          </button>
                                        </div>
                                        <div
                                          _ngcontent-serverapp-c107=""
                                          class="flex flex-col gap-4 p-4 hidden"
                                        >
                                          <ul
                                            _ngcontent-serverapp-c107=""
                                            class="divide-y divide-gray-100"
                                          >
                                            <li
                                              _ngcontent-serverapp-c107=""
                                              class="flex justify-between flex-wrap text-gray-800 py-1 ng-star-inserted"
                                            >
                                              <p _ngcontent-serverapp-c107="">
                                                Mã bệnh nhân
                                              </p>
                                              <p
                                                _ngcontent-serverapp-c107=""
                                                class="font-medium"
                                              >
                                                YMP252173792
                                              </p>
                                            </li>

                                            <li
                                              _ngcontent-serverapp-c107=""
                                              class="flex justify-between flex-wrap text-gray-800 py-2 ng-star-inserted"
                                            >
                                              <p _ngcontent-serverapp-c107="">
                                                Họ và tên
                                              </p>
                                              <p
                                                _ngcontent-serverapp-c107=""
                                                class="font-medium"
                                              >
                                                adsadasd
                                              </p>
                                            </li>

                                            <li
                                              _ngcontent-serverapp-c107=""
                                              class="flex justify-between flex-wrap text-gray-800 py-2 ng-star-inserted"
                                            >
                                              <p _ngcontent-serverapp-c107="">
                                                Giới tính
                                              </p>
                                              <p
                                                _ngcontent-serverapp-c107=""
                                                class="font-medium"
                                              >
                                                Nam
                                              </p>
                                            </li>

                                            <li
                                              _ngcontent-serverapp-c107=""
                                              class="flex justify-between flex-wrap text-gray-800 py-2"
                                            >
                                              <p _ngcontent-serverapp-c107="">
                                                Ngày sinh
                                              </p>
                                              <p
                                                _ngcontent-serverapp-c107=""
                                                class="font-medium"
                                              >
                                                01/01/1990
                                              </p>
                                            </li>
                                            <li
                                              _ngcontent-serverapp-c107=""
                                              class="flex justify-between flex-wrap text-gray-800 py-2 ng-star-inserted"
                                            >
                                              <p _ngcontent-serverapp-c107="">
                                                Số điện thoại
                                              </p>
                                              <p
                                                _ngcontent-serverapp-c107=""
                                                class="font-medium"
                                              >
                                                0977789898
                                              </p>
                                            </li>

                                            <li
                                              _ngcontent-serverapp-c107=""
                                              class="flex justify-between flex-wrap text-gray-800 py-2 ng-star-inserted"
                                            >
                                              <p _ngcontent-serverapp-c107="">
                                                Địa chỉ
                                              </p>
                                              <p
                                                _ngcontent-serverapp-c107=""
                                                class="font-medium"
                                              >
                                                ưerwewtw
                                              </p>
                                            </li>
                                          </ul>
                                          <div
                                            _ngcontent-serverapp-c107=""
                                            class="flex flex-row gap-4 items-start"
                                          >
                                            <a
                                              _ngcontent-serverapp-c107=""
                                              class="font-semibold text-sm text-primary leading-17 bg-blue-50 border-inherit shadow-sm rounded px-4 py-3"
                                              >Điều chỉnh</a
                                            >
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            _ngcontent-serverapp-c114=""
                            _nghost-serverapp-c113=""
                            class="ng-star-inserted"
                          >
                            <div
                              _ngcontent-serverapp-c113=""
                              class="space-y-4 text-gray-800 ng-star-inserted"
                            >
                              <div
                                _ngcontent-serverapp-c113=""
                                class="font-medium text-sm"
                              >
                                Thông tin bổ sung (không bắt buộc)
                              </div>
                              <div
                                _ngcontent-serverapp-c113=""
                                class="flex flex-col"
                              >
                                <label
                                  _ngcontent-serverapp-c113=""
                                  for="note"
                                  class="font-medium text-sm"
                                  >Ghi chú</label
                                >
                                <form
                                  _ngcontent-serverapp-c113=""
                                  novalidate=""
                                  class="ng-untouched ng-pristine ng-valid"
                                >
                                  <textarea
                                    _ngcontent-serverapp-c113=""
                                    rows="1"
                                    v-model="appointmentNote"
                                    nz-input=""
                                    class="ant-input rounded mt-1 ng-untouched ng-pristine ng-valid"
                                    placeholder="Triệu chứng, thuốc đang dùng, tiền sử, ..."
                                    style="
                                      max-height: 120px;
                                      min-height: 76px;
                                      height: 76px;
                                    "
                                  ></textarea>
                                </form>
                              </div>
                              <div
                                _ngcontent-serverapp-c113=""
                                class="flex flex-col"
                              >
                                <label
                                  _ngcontent-serverapp-c113=""
                                  class="font-medium text-sm"
                                  >Tập tin đính kèm (0/5)</label
                                >
                                <div
                                  _ngcontent-serverapp-c113=""
                                  nztype="drag"
                                  nzfiletype="image/png,image/jpeg"
                                  nzlisttype="picture-card"
                                  class="rounded mt-1 ant-upload-picture-card-wrapper"
                                >
                                  <div
                                    class="ant-upload ant-upload-drag ng-star-inserted"
                                  >
                                    <div
                                      class="ant-upload ant-upload-btn"
                                      tabindex="0"
                                      role="button"
                                    >
                                      <input
                                        type="file"
                                        style="display: none"
                                        multiple=""
                                      />
                                      <div class="ant-upload-drag-container">
                                        <div
                                          _ngcontent-serverapp-c113=""
                                          class="flex flex-col gap-2 ng-star-inserted"
                                        >
                                          <p
                                            _ngcontent-serverapp-c113=""
                                            class="font-normal text-sm"
                                          >
                                            <span
                                              _ngcontent-serverapp-c113=""
                                              class="text-primary"
                                              >Chọn tập tin</span
                                            >
                                            hoặc kéo thả vào đây
                                          </p>
                                          <p
                                            _ngcontent-serverapp-c113=""
                                            class="font-normal text-xs text-gray-400"
                                          >
                                            .PNG, .JPG tối đa 15MB
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div
                                    class="ant-upload-list ng-tns-c85-1 ant-upload-list-picture-card ng-star-inserted"
                                    dir="ltr"
                                  ></div>
                                </div>
                              </div>
                              <div
                                _ngcontent-serverapp-c113=""
                                class="flex flex-row justify-between font-semibold"
                              >
                                <a
                                  _ngcontent-serverapp-c113=""
                                  nz-popover=""
                                  nzpopoverplacement="right"
                                  nzpopovertrigger="click"
                                  class="text-sm border border-solid text-primary rounded py-3 px-4"
                                >
                                  Thêm hồ sơ mới </a
                                ><a
                                  _ngcontent-serverapp-c113=""
                                  class="bg-primary border border-primary hover:bg-primary/80 hover:text-white px-4 py-3 rounded text-sm text-white"
                                  hidden=""
                                  >Xác nhận</a
                                >
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          _ngcontent-serverapp-c115=""
          class="col-span-12 md:p-0 md:z-auto px-4 md:col-span-5 lg:col-span-4 bg-white md:bg-transparent"
        >
          <div _ngcontent-serverapp-c115="" class="sticky top-20">
            <div
              _ngcontent-serverapp-c115=""
              class="bg-white md:rounded-lg overflow-hidden ng-star-inserted"
            >
              <div>
                <div class="ng-star-inserted">
                  <div
                    _ngcontent-serverapp-c103=""
                    class="hidden md:block divide-y divide-gray-100"
                  >
                    <div
                      _ngcontent-serverapp-c103=""
                      class="flex items-center flex-row justify-between px-4 lg:px-6 py-4 bg-white rounded-t-md"
                    >
                      <div
                        _ngcontent-serverapp-c103=""
                        class="font-semibold text-base text-gray-800"
                      >
                        Thông tin đặt khám
                      </div>
                      <img
                        :src="arrowDownIcon"
                        alt="Arrow Down 1"
                        class="w-[18px] h-[18px] rotate-180"
                      />
                    </div>
                    <div
                      _ngcontent-serverapp-c103=""
                      class="flex flex-row items-center gap-4 px-4 lg:px-6 py-2"
                    >
                      <div
                        _ngcontent-serverapp-c103=""
                        class="flex-none ng-star-inserted"
                      >
                        <img
                          _ngcontent-serverapp-c103=""
                          class="w-[60px] h-[60px] object-scale-down rounded-full "
                          :alt="doctorName"
                          :src="imageUrl"
                        />
                      </div>

                      <div _ngcontent-serverapp-c103="">
                        <p
                          _ngcontent-serverapp-c103=""
                          class="font-medium text-base"
                        >
                          {{ doctorName || doctor?.name || 'Đang tải...' }}
                        </p>
                        <p
                          _ngcontent-serverapp-c103=""
                          class="font-normal text-xs text-gray-500 line-clamp-2"
                        >
                          {{ clinicName || doctor?.clinics?.[0]?.name || '' }}
                        </p>
                      </div>
                    </div>
                    <div
                      _ngcontent-serverapp-c103=""
                      class="p-4 lg:px-6 bg-white"
                    >
                      <div
                        _ngcontent-serverapp-c103=""
                        class="ng-star-inserted"
                      >
                        <div
                          _ngcontent-serverapp-c103=""
                          class="flex flex-row justify-between py-2 text-gray-800 ng-star-inserted"
                        >
                          <div _ngcontent-serverapp-c103="">Ngày khám</div>
                          <div _ngcontent-serverapp-c103="" class="font-medium">
                            {{ appointmentDate || 'Chưa chọn' }}
                          </div>
                        </div>

                        <div
                          _ngcontent-serverapp-c103=""
                          class="flex flex-row justify-between py-2 text-gray-800 ng-star-inserted"
                          v-if="timeSlot"
                        >
                          <div _ngcontent-serverapp-c103="">Khung giờ</div>
                          <div _ngcontent-serverapp-c103="" class="font-medium">
                            {{ timeSlot }}
                          </div>
                        </div>
                      </div>

                      <div
                        _ngcontent-serverapp-c103=""
                        class="flex flex-row justify-between py-2 text-gray-800 ng-star-inserted"
                      >
                        <div _ngcontent-serverapp-c103="" class="flex-none">
                          Bệnh nhân
                        </div>
                        <div
                          _ngcontent-serverapp-c103=""
                          class="font-medium ng-star-inserted"
                        >
                          {{ selectedRecord?.patientName || 'Chưa chọn' }}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    _ngcontent-serverapp-c103=""
                    class="ant-spin-nested-loading"
                  >
                    <div class="ant-spin-container ng-star-inserted">
                      <div
                        _ngcontent-serverapp-c103=""
                        class="md:p-4 bg-white ng-star-inserted"
                      >
                        <button
                          _ngcontent-serverapp-c103=""
                          @click="submitAppointment"
                          :disabled="loading || !selectedRecord"
                          class="w-full button font-semibold text-sm text-white px-4 py-4 bg-primary ng-star-inserted disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {{ loading ? 'Đang xử lý...' : 'Đặt lịch' }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  _ngcontent-serverapp-c104=""
                  class="p-6 pt-2 text-center"
                ></div>
              </div>
            </div>

            <div _ngcontent-serverapp-c115="" class="mt-2">
              <p
                _ngcontent-serverapp-c115=""
                class="font-normal text-xs text-gray-600"
              >
                Bằng cách nhấn nút xác nhận, bạn đã đồng ý với
                <a _ngcontent-serverapp-c115="" href="#" target="_blank"
                  >các điều khoản và điều kiện đặt khám</a
                >
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { ref, computed, onMounted } from "vue";
import arrowDownIcon from "@/assets/images/arrow-down.svg";
import borderIcon from "@/assets/images/border.svg";
import checkedBgBlueIcon from "@/assets/images/checked-bg-blue.svg";
import familyBlockIcon from "@/assets/images/family-block.svg";
import doctorApi from "@/api/doctorApi";
import appointmentApi from "@/api/appointmentApi";

const route = useRoute();
const router = useRouter();

// State
const doctor = ref(null);
const doctorInfo = ref(null);
const imageUrl = ref("");
const selectedRecord = ref(null);
const loading = ref(false);
const appointmentNote = ref("");

// Computed từ query params
const doctorSlug = computed(() => route.query.doctorSlug || "");
const doctorName = computed(() => route.query.doctorName || "");
const appointmentTime = computed(() => route.query.time || "");
const appointmentDate = computed(() => route.query.date || "");
const timeSlot = computed(() => route.query.timeSlot || "");
const clinicName = computed(() => route.query.clinicName || "");
const specialty = computed(() => route.query.specialty || "");

// Mock data cho bệnh nhân (trong thực tế sẽ lấy từ API)
const patientRecords = ref([
  {
    patientId: "YMP252146155",
    patientName: "Nguyễn Văn Addd",
    phone: "0978567567",
    gender: "Nam",
    dateOfBirth: "23/02/1990",
    address: "số nhà 234523",
    relationshipType: "Tôi"
  },
  {
    patientId: "YMP252173792", 
    patientName: "adsadasd",
    phone: "0977789898",
    gender: "Nam",
    dateOfBirth: "01/01/1990",
    address: "ưerwewtw",
    relationshipType: "Cha"
  }
]);

// Lấy thông tin bác sĩ khi có slug
const fetchDoctorDetails = async () => {
  if (!doctorSlug.value) return;
  
  try {
    loading.value = true;
    const response = await doctorApi.getBySlug(doctorSlug.value);
    if (response.succeeded && response.data) {
      doctor.value = response.data;
      imageUrl.value = "https://localhost:7038" + response.data.doctorInfos[0].imageUrl;
      console.log(imageUrl.value);
    }
  } catch (error) {
    console.error("Lỗi khi lấy thông tin bác sĩ:", error);
  } finally {
    loading.value = false;
  }
};

// Chọn hồ sơ bệnh nhân
const selectRecord = (record) => {
  selectedRecord.value = record;
};

// Hàm lấy logo phòng khám
const getDoctorLogo = () => {
  
  if (doctorInfo.value?.imageUrl) {
    return "https://localhost:7038" + doctorInfo.value.imageUrl;
  }

  // Logo mặc định
  return "https://cdn.youmed.vn/photos/fb4179f1-d0e9-4e2a-98a2-26e6efe7add8.png";
};

// Xử lý đặt lịch khám
const submitAppointment = async () => {
  if (!selectedRecord.value) {
    alert("Vui lòng chọn hồ sơ bệnh nhân");
    return;
  }

  if (!doctor.value) {
    alert("Không tìm thấy thông tin bác sĩ");
    return;
  }

  try {
    loading.value = true;
    
    // Tạo data để gửi API
    const appointmentData = {
      // patientId: selectedRecord.value.patientId,
      doctorId: doctor.value.doctorId,
      appointmentDate: formatDateForAPI(appointmentDate.value),
      timeType: timeSlot.value,
      reason: appointmentNote.value || ""
    };

    const response = await appointmentApi.create(appointmentData);
    
    if (response.succeeded) {
      alert("Đặt lịch khám thành công!");
      // Chuyển về trang chủ hoặc trang lịch hẹn
      router.push("/");
    } else {
      alert(response.message || "Có lỗi xảy ra khi đặt lịch");
    }
  } catch (error) {
    console.error("Lỗi khi đặt lịch:", error);
    alert("Có lỗi xảy ra khi đặt lịch khám");
  } finally {
    loading.value = false;
  }
};

// Format date cho API (chuyển từ "Th 2, 19-05" sang "2024-05-19")
const formatDateForAPI = (dateLabel) => {
  if (!dateLabel) return new Date().toISOString().split('T')[0];
  
  // Đây là logic đơn giản, trong thực tế cần parse chính xác hơn
  const currentYear = new Date().getFullYear();
  const dateParts = dateLabel.split(', ')[1]?.split('-');
  if (dateParts && dateParts.length === 2) {
    const day = dateParts[0].padStart(2, '0');
    const month = dateParts[1].padStart(2, '0');
    return `${currentYear}-${month}-${day}`;
  }
  
  return new Date().toISOString().split('T')[0];
};

// Hook lifecycle
onMounted(() => {
  fetchDoctorDetails();
  // Mặc định chọn bệnh nhân đầu tiên
  if (patientRecords.value.length > 0) {
    selectedRecord.value = patientRecords.value[0];
  }
});
</script>
