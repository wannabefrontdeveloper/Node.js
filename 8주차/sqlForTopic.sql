CREATE TABLE `topic` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(30) NOT NULL,
  `description` TEXT,
  `created` DATETIME NOT NULL,
  `author_id` INT(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`author_id`) REFERENCES `author`(`id`)
);

insert topic
values(1,'MySQL','MySQL is Database Name.','2023-09-20',1);

insert topic
values(2,'Node.js','Node.js is runtime of javascript','2023-09-20',1);

insert topic
values(3,'HTML','HTML is Hyper Text Markup Language','2023-09-20',1);

insert topic
values(4,'CSS','CSS is used to decorate HTML Page.','2023-09-20',1);

insert topic
values(5,'express','express is the framework for web service.','2023-09-20',1);


