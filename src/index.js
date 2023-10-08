/**
 * 文件/目录操作封装工具
 */
class FdOp {
	constructor(fs, path) {
		this.fs = fs
		this.path = path
	}

	/**
	 * 重命名文件/目录：可移动文件/目录到指定位置，如果是目录也包含其子文件
	 */
	rename(filePath, newFilePath) {
		return new Promise((resolve, reject) => {
			this.fs.rename(filePath, newFilePath, err => {
				if (err) {
					reject(err)
				} else {
					resolve()
				}
			})
		})
	}

	/**
	 * 获取该目录的体积大小
	 * @param {Object} dir 目录路径
	 */
	async getDirSize(dir) {
		let size = 0
		const info = await this.stat(dir)
		//如果是文件
		if (info.isFile()) {
			size += info.size
		} else {
			//如果是目录
			//获取目录下的文件
			const files = await this.readdir(dir)
			for (let i = 0; i < files.length; i++) {
				size += await this.getDirSize(this.path.join(dir, files[i]))
			}
		}
		return size
	}

	/**
	 * 读取文件内容
	 * @param {Object} filePath 文件路径
	 */
	readFile(filePath) {
		return new Promise((resolve, reject) => {
			this.fs.readFile(filePath, 'utf8', (err, data) => {
				if (err) {
					reject(err)
				} else {
					resolve(data)
				}
			})
		})
	}

	/**
	 * 写入文本内容：覆盖原内容
	 * @param {Object} filePath 文件路径
	 * @param {Object} text 写入的文本内容
	 */
	writeFile(filePath, text) {
		return new Promise((resolve, reject) => {
			this.fs.writeFile(filePath, text, err => {
				if (err) {
					reject(err)
				} else {
					resolve()
				}
			})
		})
	}

	/**
	 * 文件写入内容：追加
	 * @param {Object} filePath 文件路径
	 * @param {Object} text 写入的文本内容
	 */
	appendFile(filePath, text) {
		return new Promise((resolve, reject) => {
			this.fs.appendFile(filePath, text, err => {
				if (err) {
					reject(err)
				} else {
					resolve()
				}
			})
		})
	}

	/**
	 * 拷贝文件
	 * @param {Object} filePath 文件路径
	 * @param {Object} copyFilePath 复制后的文件路径
	 */
	copyFile(filePath, copyFilePath) {
		return new Promise((resolve, reject) => {
			this.fs.copyFile(filePath, copyFilePath, err => {
				if (err) {
					reject(err)
				} else {
					resolve()
				}
			})
		})
	}

	/**
	 * 打开文件
	 * @param {Object} filePath 文件路径
	 * @param {Object} mode 模式：r（读取模式，r+（读写模式），w（写入模式，如果文件不存在则创建），w+（读写模式，如果文件不存在则创建），wx（写入模式，如果文件不存在则返回失败），wx+（读写模式，如果文件不存在则返回失败），a（追加模式，如果文件不存在则创建），a+（读取追加模式，如果文件不存在则创建），ax（追加模式，如果文件不存在则返回失败），ax+（读取追加模式，如果文件不存在则返回失败）
	 */
	openFile(filePath, mode) {
		return new Promise((resolve, reject) => {
			this.fs.open(filePath, mode, (err, fd) => {
				if (err) {
					reject(err)
				} else {
					resolve(fd)
				}
			})
		})
	}

	/**
	 * 关闭文件
	 * @param {Object} fd 打开文件时返回的文件标识符
	 */
	closeFile(fd) {
		return new Promise((resolve, reject) => {
			this.fs.close(fd, (fd, err) => {
				if (err) {
					reject(err)
				} else {
					resolve()
				}
			})
		})
	}

	/**
	 * 查看文件或者目录的操作权限，可读写返回true，否则返回false，文件不存在也返回false
	 * @param {Object} filePath 文件路径
	 */
	access(filePath) {
		return new Promise(resolve => {
			this.fs.access(filePath, this.fs.constants.R_OK | this.fs.constants.W_OK, err => {
				if (err) {
					resolve(false) //不可访问
				} else {
					resolve(true) //可读写
				}
			})
		})
	}

	/**
	 * 获取文件/目录信息
	 * @param {Object} filePath 文件或者目录路径
	 */
	stat(filePath) {
		return new Promise((resolve, reject) => {
			this.fs.stat(filePath, (err, obj) => {
				if (err) {
					reject(err)
				} else {
					resolve(obj)
				}
			})
		})
	}

	/**
	 * 判断文件/目录是否存在
	 * @param {Object} filePath 文件或者目录路径
	 */
	exist(filePath) {
		return new Promise((resolve, reject) => {
			this.fs.exists(filePath, exist => {
				if (exist) {
					resolve(true)
				} else {
					resolve(false)
				}
			})
		})
	}

	/**
	 * 创建目录
	 * @param {Object} dir 目录路径
	 */
	mkdir(dir) {
		return new Promise((resolve, reject) => {
			this.fs.mkdir(dir, err => {
				if (err) {
					reject(err)
				} else {
					resolve()
				}
			})
		})
	}

	/**
	 * 递归创建目录
	 * @param {Object} dir 目录路径
	 */
	mkdirs(dir) {
		return new Promise(async (resolve, reject) => {
			this.exist(dir).then(exist => {
				if (exist) {
					//如果目录存在
					resolve()
				} else {
					//目录不存在
					this.mkdirs(this.path.dirname(dir))
						.then(() => {
							return this.mkdir(dir)
						})
						.then(() => {
							resolve()
						})
						.catch(err => {
							reject(err)
						})
				}
			})
		})
	}

	/**
	 * 读取目录下的所有文件列表
	 * @param {Object} dir 目录路径
	 */
	readdir(dir) {
		return new Promise((resolve, reject) => {
			this.fs.readdir(dir, (err, data) => {
				if (err) {
					reject(err)
				} else {
					resolve(data)
				}
			})
		})
	}

	/**
	 * 删除目录：只能删除空目录
	 * @param {Object} dir 目录路径
	 */
	rmdir(dir) {
		return new Promise((resolve, reject) => {
			this.fs.rmdir(dir, err => {
				if (err) {
					reject(err)
				} else {
					resolve()
				}
			})
		})
	}

	/**
	 * 递归删除目录：直接删除目录下的所有文件
	 * @param {Object} dir
	 */
	async rmdirs(dir) {
		const files = await this.readdir(dir)
		if (files.length == 0) {
			await this.rmdir(dir)
		} else {
			for (let i = 0; i < files.length; i++) {
				const info = await this.stat(dir + this.path.sep + files[i])
				if (info.isDirectory()) {
					await this.rmdirs(dir + this.path.sep + files[i])
				} else {
					await this.rmFile(dir + this.path.sep + files[i])
				}
			}
			this.rmdirs(dir)
		}
	}

	/**
	 * 删除文件
	 * @param {Object} filePath 文件路径
	 */
	rmFile(filePath) {
		return new Promise((resolve, reject) => {
			this.fs.unlink(filePath, err => {
				if (err) {
					reject(err)
				} else {
					resolve()
				}
			})
		})
	}
}

module.exports = FdOp
